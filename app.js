const OBSWebSocket = require('obs-websocket-js')
const obs = new OBSWebSocket()

const CronJob = require('cron').CronJob;

function retract() {
  obs.connect({address: '127.0.0.1:4444'})
    .then(
      script => {
        obs.send('TriggerHotkeyByName', { hotkeyName: 'ROTATE_ccw' })
          .catch( err => console.log(err))
          .finally( () => obs.disconnect() )
      },
      error => console.log(error)
    );

  console.log('OBS Hotkey Retract at: ' + new Date().toLocaleString())
}

const job0 = new CronJob('30 */2 * * * ', retract)
const job1 = new CronJob('10,50 1-23/2 * * *', retract)
job0.start()
job1.start()
