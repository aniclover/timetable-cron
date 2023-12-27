const OBSWebSocket = require('obs-websocket-js')
const obs = new OBSWebSocket()

const CronJob = require('cron').CronJob;

async function wsOneShot(command, data) {
  try {
    await obs.connect({address: '127.0.0.1:4444'})
    await obs.send(command, data)
  } catch (err) {
    console.log(err)
    obs.disconnect()
    try {
      await obs.connect({address: '127.0.0.1:4444'})
      await obs.send(command, data)  
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
  wsOneShot('TriggerHotkeyBySequence', { keyId: 'OBS_KEY_NUMASTERISK' })
  console.log('OBS Hotkey Retract at: ' + new Date().toLocaleString())
}

function screenshot() {
  wsOneShot('TriggerHotkeyByName', { hotkeyName: 'OBSBasic.Screenshot' })
  console.log('OBS Screenshot at: ' + new Date().toLocaleString())
}

const job0 = new CronJob('10,50 */2 * * * ', retract)
const job1 = new CronJob('30 1-23/2 * * *', retract)
// const job2 = new CronJob('*/15 * * * *', screenshot)

job0.start()
job1.start()
// job2.start()

console.log('Timetable Cron Launched')
