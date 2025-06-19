'use client'
import { styled } from '@mui/material/styles'
import { Typography as T, Button } from '@mui/material'
import getClassPrefixer from '~/app/UI/classPrefixer'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { notFound } from '~/app/UI/Images'

const displayName = 'NotFound'
const classes = getClassPrefixer(displayName)

const NotFoundContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: '8rem',
  '@media (max-width: 768px)': {
    padding: '2rem 4rem',
  },
  [`& .${classes.mainContainer}`]: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  [`& .${classes.textContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1rem',
    width: '50%',
    '@media (max-width: 768px)': {
      width: '60%',
    },
  },
  [`& .${classes.buttonContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  [`& .${classes.button}`]: {
    padding: '1ch',
    background: theme.palette.primary.main,
    color: theme.palette.background.main,
  },
}))

const NotFound = () => {
  const router = useRouter()
  return (
    <NotFoundContainer>
      <div className={classes.mainContainer}>
        <div className={classes.textContainer}>
          <T variant="h3" color='primary.main'>
            404 - Page Not Found
          </T>
          <T variant="h6" color='primary.main'>
            Oops! The page you&#39;re looking for doesn&#39;t exist or has been moved. Return to the homepage to continue shopping.
          </T>
          <div className={classes.buttonContainer}>
            <Button
              className={classes.button}
              variant='contained'
              onClick={() => router.replace('/')}
            >
              Back to Homepage
            </Button>
          </div>
        </div>
        <div>
          <Image
            src={notFound}
            alt='Not Found'
            width={400}
            height={400}
            layout="intrinsic"
          />
        </div>
      </div>
    </NotFoundContainer>
  )
}

export default NotFound