let playmode = 0
let status = 0
let second = 0
let Minute = 0
let Hour = 0
let x = 0
let x_Flash1 = 0
let x_Flash2 = 0
let irNumber1 = 0
let irNumber2 = 0
let year = 2019
let month = 1
let day = 1
let x_width = 16
let songName = ""
let songName_Old = ""
OLED.init()
makerbit.connectSerialMp3(DigitalPin.P8, DigitalPin.P12)
makerbit.setMp3Volume(10)
makerbit.setMp3Mode(Mp3PLAYMODE.ALL_REPEAT)
basic.pause(200)
makerbit.playMp3Track("DONG", "003")
makerbit.connectInfrared(DigitalPin.P5)
makerbit.setRGB(ColorList.white)
OLED.drawString(
56,
32,
FrontSize.Size16X16,
"VOL:"
)
OLED.drawNumber16X8(
96,
32,
2,
makerbit.mp3Volume()
)
OLED.drawString(
0,
32,
FrontSize.Size16X16,
"LOOP"
)
OLED.drawNumber32X16(
16,
0,
2,
Hour
)
OLED.drawString(
48,
0,
FrontSize.Size32X32,
":"
)
OLED.drawNumber32X16(
64,
0,
2,
Minute
)
OLED.drawNumber16X8(
102,
12,
2,
second
)
basic.forever(function () {
    second = second + 1
    if (second >= 60) {
        second = 0
        Minute = Minute + 1
        if (Minute >= 60) {
            Minute = 0
            Hour = Hour + 1
            if (Hour >= 24) {
                Hour = 0
            }
            OLED.drawNumber32X16(
            16,
            0,
            2,
            Hour
            )
        }
        OLED.drawNumber32X16(
        64,
        0,
        2,
        Minute
        )
    }
    OLED.drawNumber16X8(
    102,
    12,
    2,
    second
    )
    songName = makerbit.mp3TrackShortName()
    if (songName != songName_Old) {
        songName_Old = songName
        OLED.drawString(
        0,
        48,
        FrontSize.Size16X16,
        "            "
        )
        OLED.drawString(
        0,
        48,
        FrontSize.Size16X16,
        songName
        )
    }
    for (let i = 0; i < 20; i++) {
        basic.pause(50)
        if (makerbit.isIrButtonPressed(IrButton.Right)) {
            makerbit.runMp3Command(Mp3Command.PLAY_NEXT_TRACK)
        }
        if (makerbit.isIrButtonPressed(IrButton.Left)) {
            makerbit.runMp3Command(Mp3Command.PLAY_PREVIOUS_TRACK)
        }
        if (makerbit.isIrButtonPressed(IrButton.Ok)) {
            if (status == 0) {
                status = 1
                makerbit.runMp3Command(Mp3Command.PLAY)
                OLED.drawIcon(104, 48, OledIcon.play)
            } else {
                status = 0
                makerbit.runMp3Command(Mp3Command.PAUSE)
                OLED.drawIcon(104, 48, OledIcon.pause)
            }
        }
        if (makerbit.isIrButtonPressed(IrButton.Up)) {
            makerbit.runMp3Command(Mp3Command.INCREASE_VOLUME)
            OLED.drawNumber16X8(
            96,
            32,
            2,
            makerbit.mp3Volume()
            )
        }
        if (makerbit.isIrButtonPressed(IrButton.Down)) {
            makerbit.runMp3Command(Mp3Command.DECREASE_VOLUME)
            OLED.drawNumber16X8(
            96,
            32,
            2,
            makerbit.mp3Volume()
            )
        }
        if (makerbit.isIrButtonPressed(IrButton.Star)) {
            if (playmode == 0) {
                playmode = 1
                OLED.drawString(
                0,
                32,
                FrontSize.Size16X16,
                "LOOP"
                )
                makerbit.setMp3Mode(Mp3PLAYMODE.ALL_REPEAT)
            } else {
                playmode = 0
                OLED.drawString(
                0,
                32,
                FrontSize.Size16X16,
                "ONCE"
                )
                makerbit.setMp3Mode(Mp3PLAYMODE.SINGLE_ONCE)
            }
        }
    }
})
