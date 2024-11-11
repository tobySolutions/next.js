import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('unstable_after during server shutdown', () => {
  const { next, skipped, isNextDev } = nextTestSetup({
    files: __dirname,
    skipDeployment: true, // the tests use cli logs
    skipStart: true,
  })
  if (skipped) {
    return
  }

  beforeEach(async () => {
    await next.start()
  })

  if (isNextDev) {
    it.each(['SIGINT', 'SIGTERM'] as const)(
      'does not wait for unstable_after callbacks when the server receives %s',
      async (signal) => {
        await next.browser('/')
        await retry(async () => {
          expect(next.cliOutput).toInclude('[after] starting sleep')
        })
        await next.stop(signal)
        expect(next.cliOutput).not.toInclude('[after] finished sleep')
      }
    )
  }

  if (!isNextDev) {
    it.each(['SIGINT', 'SIGTERM'] as const)(
      'waits for unstable_after callbacks when the server receives %s',
      async (signal) => {
        await next.browser('/')
        await retry(async () => {
          expect(next.cliOutput).toInclude('[after] starting sleep')
        })
        await next.stop(signal)
        expect(next.cliOutput).toInclude('[after] finished sleep')
      }
    )
  }
})
