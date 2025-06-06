import { NextResponse } from "next/server";
import { Supplier } from "~/api/entities";
import { authenticateToken } from "~/app/api/Libs/auth";
import ERROR from "~/Libs/error";
import cleanerData from "~/app/api/Libs/cleanerData";
import validatorFields from "~/app/api/Libs/validatorFields";
import prisma from "~/app/api/Libs/prisma";

export const POST = async (request) => {
  try {
    const { role = null, userId } = authenticateToken(request) ?? {};
    if (role !== "ADMIN" || !userId) return ERROR.FORBIDDEN();
    const data = await request.json();
    const isValid = validatorFields({ data, shape: Supplier.shape });
    if (isValid) {
      const payload = await prisma.supplier.create({
        data,
      });
      const response = cleanerData({ payload });
      return NextResponse.json(response, { status: 201 });
    }
    return ERROR.FORBIDDEN();
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
};

export const GET = async (request) => {
  try {
    const { role, userId } = authenticateToken(request) ?? {};
    if (role !== "ADMIN" || !userId) return ERROR.FORBIDDEN();
    const payloads = await prisma.supplier.findMany();
    if (payloads.length > 0) {
      const response = payloads.map((payload) => cleanerData({ payload }));
      return NextResponse.json(response, { status: 200 });
    }
    return ERROR.NOT_FOUND();
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
};
