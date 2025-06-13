'use client'
import { styled } from '@mui/material/styles'
import { Typography as T, Button } from '@mui/material'
import getClassPrefixer from '~/app/UI/classPrefixer'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { forbidden } from '~/app/UI/Images'

const displayName = 'NotAvailable'
const classes = getClassPrefixer(displayName)

const NotAvailableContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: '10rem',
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

const NotAvailable = () => {
  const router = useRouter()
  return (
    <NotAvailableContainer>
      <div className={classes.mainContainer}>
        <div className={classes.textContainer}>
          <T variant="h3" color='primary.main'>
            An error occurred
          </T>
          <T variant="h6" color='primary.main'>
            What you are looking for is not available at this moment. Please click the button below to continue.
          </T>
          <div className={classes.buttonContainer}>
            <Button
              className={classes.button}
              variant='contained'
              onClick={() => router.replace('/')}
            >
              Here
            </Button>
          </div>
        </div>
        <div>
          <Image
            src={forbidden}
            alt='Not Available'
            width={400}
            height={400}
            layout="intrinsic"
          />
        </div>
      </div>
    </NotAvailableContainer>
  )
}

export default NotAvailable