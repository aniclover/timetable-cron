const OBSWebSocket = require('obs-websocket-js').default
const obs = new OBSWebSocket()

const CronJob = require('cron').CronJob;

async function wsOneShot(command, data) {
  try {
    // await obs.connect({address: '127.0.0.1:4444'})
    // await obs.send(command, data)
    await obs.connect()
    await obs.call(command, data)
  } catch (err) {
    console.log(err)
    obs.disconnect()
    try {
      await obs.connect()
      await obs.call(command, data)
    } catch (err) {
      // Do nothing
      console.log("Retry failed, skipping...")
    } finally {
      obs.disconnect()
    }
  } finally {
    obs.disconnect()
  }
}

function retract() {
  wsOneShot('TriggerHotkeyByKeySequence', { keyId: 'OBS_KEY_NUMASTERISK' })
  console.log('OBS Hotkey Retract at: ' + new Date().toLocaleString())
}

function screenshot() {
  wsOneShot('TriggerHotkeyByName', { hotkeyName: 'OBSBasic.Screenshot' })
  console.log('OBS Screenshot at: ' + new Date().toLocaleString())
}

const job0 = new CronJob('30 */2 * 12 * ', retract, null, true, 'America/Los_Angeles')
const job1 = new CronJob('10,50 1-23/2 * 12 *', retract, null, true, 'America/Los_Angeles')
const job2 = new CronJob('0,40 */2 * 1 * ', retract, null, true, 'America/Los_Angeles')
const job3 = new CronJob('20 1-23/2 * 1 *', retract, null, true, 'America/Los_Angeles')
// const job4 = new CronJob('*/1 * * 1 *', retract, null, true, 'America/Los_Angeles')


// const job2 = new CronJob('*/15 * * * *', screenshot)

console.log('Timetable Cron Launched')
