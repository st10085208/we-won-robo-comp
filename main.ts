// for wifi connection
function wait_for_response(str: string) {
    time = input.runningTime()
    while (true) {
        serial_str = "" + serial_str + serial.readString()
        if (serial_str.length > 200) {
            serial_str = serial_str.substr(serial_str.length - 200, 0)
        }
        if (serial_str.includes(str)) {
            result2 = true
            break;
        }
        if (input.runningTime() - time > 300000) {
            break;
        }
    }
    return result2
}
let result2 = false
let time = 0
let HTTP_pos = 0
let GET_pos = 0
let ip_address = ""
let serial_str = ""
let result = false
let GET_command = ""
let client_ID = ""
let GET_success: boolean = false
// user settings
// 1 = STA (station, connect to wifi router); 2 = AP (make itself an access point)
let WIFI_MODE = 2
const Tx_pin: SerialPin = SerialPin.P12
const Rx_pin: SerialPin = SerialPin.P8
// pin for LED control
let LED_pin = DigitalPin.P2
// wifi router ssid for station mode
let SSID_1 = "-----"
let PASSWORD_1 = "-----"
// AP server ssid for AP mode
let SSID_2 = "Robot-V2-Team-10"
// AP password for AP mode (at least 8 characters)
let PASSWORD_2 = "helloworld"
// initialize LED
pins.digitalWritePin(LED_pin, 0)
serial.redirect(Tx_pin, Rx_pin, 115200)
sendAT("AT+RESTORE", 1000)
sendAT("AT+RST", 1000)
sendAT("AT+CWMODE=" + WIFI_MODE)
if (WIFI_MODE == 1) {
    sendAT("AT+CWJAP=\"" + SSID_1 + "\",\"" + PASSWORD_1 + "\"")
    result = wait_for_response("OK")
    if (!(result)) {
        control.reset()
    }
} else if (WIFI_MODE == 2) {
    sendAT("AT+CWSAP=\"" + SSID_2 + "\",\"" + PASSWORD_2 + "\",1,4", 1000)
}
sendAT("AT+CIPMUX=1")
sendAT("AT+CIPSERVER=1,80")
sendAT("AT+CIFSR")
// Get and print the IP address
serial_str = serial.readString()
if (serial_str.includes("+CIFSR:STAIP")) {
    ip_address = serial_str.substr(serial_str.indexOf("STAIP") + 7, 15)
    serial.writeString("IP Address: " + ip_address + "\n")
}
// startup completed
basic.showIcon(IconNames.Yes)
// process HTTP request
while (true) {
    // read and store 200 characters from serial port
    serial_str = "" + serial_str + serial.readString()
    if (serial_str.length > 1000) {
        serial_str = serial_str.substr(serial_str.length - 1000, 0)
    }
    if (serial_str.includes("+IPD") && serial_str.includes("HTTP")) {
        // got a HTTP request
        client_ID = serial_str.substr(serial_str.indexOf("IPD") + 4, 1)
        GET_pos = serial_str.indexOf("GET")
        HTTP_pos = serial_str.indexOf("HTTP")
        GET_command = serial_str.substr(GET_pos + 5, HTTP_pos - 1 - (GET_pos + 5))
        switch (GET_command) {

            case "":
                GET_success = true
                break
            case "tick":
                GET_success = true
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.AllMotor, maqueenPlusV2.MyEnumDir.Forward, 255)
                basic.showArrow(ArrowNames.North)
                basic.pause(400)
                maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor)
                basic.showIcon(IconNames.Angry)
                break
            case "forward":
                GET_success = true
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.AllMotor, maqueenPlusV2.MyEnumDir.Forward, 100)
                basic.showArrow(ArrowNames.North)
                basic.pause(400)
                maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor)
                basic.showIcon(IconNames.Happy)
                break
            case "back":
                GET_success = true
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.AllMotor, maqueenPlusV2.MyEnumDir.Backward, 100)
                basic.showArrow(ArrowNames.South)
                basic.pause(400)
                maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor)
                basic.showIcon(IconNames.Sad)
                break
            case "left":
                GET_success = true
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Backward, 50)
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Forward, 50)
                basic.showArrow(ArrowNames.East)
                basic.pause(50)
                maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor)
                basic.showIcon(IconNames.Confused)
                break
            case "slightleft":
                GET_success = true
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Backward, 25)
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Forward, 25)
                basic.showArrow(ArrowNames.East)
                basic.pause(50)
                maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor)
                basic.showIcon(IconNames.Confused)
                break
            case "right":
                GET_success = true
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Forward, 50)
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Backward, 50)
                basic.showArrow(ArrowNames.West)
                basic.pause(50)
                maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor)
                basic.showIcon(IconNames.Confused)
                break
            case "slightright":
                GET_success = true
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Forward, 25)
                maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Backward, 25)
                basic.showArrow(ArrowNames.West)
                basic.pause(50)
                maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor)
                basic.showIcon(IconNames.Confused)
                break
            case "happy":
                GET_success = true
                basic.showIcon(IconNames.Happy)
                music.play(music.tonePlayable(440, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
                music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
                music.play(music.tonePlayable(294, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
                music.play(music.tonePlayable(349, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
                break
            case "sad":
                GET_success = true
                basic.showIcon(IconNames.Sad)
                music.play(music.tonePlayable(698, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
                music.play(music.tonePlayable(587, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
                music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
                music.play(music.tonePlayable(440, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
                break
            case "auto":
                GET_success = true
                maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.LeftMotor)
                break
            case "scream":
                GET_success = true;
                basic.showIcon(IconNames.Heart)
                music.setVolume(255)
                music.setTempo(72)
                for (let i = 0; i < 4; i++) {
                    music.play(music.tonePlayable(277, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(523, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(554, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(277, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(523, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(440, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(277, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(440, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(277, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(440, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(415, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.play(music.tonePlayable(370, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                    music.rest(music.beat(BeatFraction.Quarter))
                    music.play(music.tonePlayable(370, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
                }
                for (let j = 0; j < 4; j++) { // Spin for a short time
                    maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Forward, 150);
                    maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Backward, 150);
                    basic.pause(1000);
                }
                maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor); // Stop motors

                basic.showIcon(IconNames.Happy); // Show happy face
                break;
        }
        sendAT("AT+CIPCLOSE=" + client_ID)
        serial_str = ""
    }
}
function sendAT(command: string, waitTime: number = 50) {
    serial.writeString(command + "\u000D\u000A")
    basic.pause(waitTime)
}