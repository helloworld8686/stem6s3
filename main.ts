/*let commandBuffer: Buffer;
let commandBuffer_Tx:Buffer
serial.redirect(
    SerialPin.P8,
    SerialPin.P12,
    BaudRate.BaudRate9600
)
serial.writeLine(" ")
serial.writeLine("helloworld")

commandBuffer = pins.createBuffer(8);
commandBuffer.setNumber(NumberFormat.UInt8LE, 0, 0xAA);
commandBuffer.setNumber(NumberFormat.UInt8LE, 1, 0x01);
commandBuffer.setNumber(NumberFormat.UInt8LE, 2, 0x02);    
commandBuffer.setNumber(NumberFormat.UInt8LE, 3, 0x33)
    basic.forever(function () {
        basic.pause(100)
        commandBuffer_Tx = commandBuffer.slice(0, 4)
        serial.writeBuffer(commandBuffer_Tx);
        commandBuffer.setNumber(NumberFormat.UInt8LE, 0, 0x33);
        commandBuffer.setNumber(NumberFormat.UInt8LE, 1, 0x33);
        commandBuffer.setNumber(NumberFormat.UInt8LE, 2, 0x33)

    })
*/

let Hour = 0
let Minute = 0
let second = 0
let year = 2019
let month = 1
let day = 1
let songName =""
let songName_Old = ""
let x = 0
let x_width = 16
let x_Flash1 = 0
let x_Flash2 = 0
let irNumber1 = 0
let irNumber2 = 0
let status = 0
let playmode = Mp3PLAYMODE.SINGLE_ONCE

OLED.init()
makerbit.connectSerialMp3(DigitalPin.P8, DigitalPin.P12)
makerbit.setMp3Volume(10)
makerbit.setMp3Mode(Mp3PLAYMODE.SINGLE_ONCE)
basic.pause(200)
//makerbit.playMp3Track("chengquan","")
//makerbit.playMp3Track("", "abc")
//makerbit.playMp3Track("dongtian", "003")
makerbit.playMp3Track("DONG", "003")
makerbit.connectInfrared(DigitalPin.P5)
OLED.drawString(56, 32, FrontSize.Size16X16, "VOL:")
OLED.drawNumber16X8(96, 32, 2, makerbit.mp3Volume())
OLED.drawString(0,32, FrontSize.Size16X16, "ONCE")



/*
input.onButtonPressed(Button.A, function () {
    makerbit.runMp3Command(Mp3Command.PLAY_NEXT_TRACK)
    songName = makerbit.mp3TrackShortName()
    OLED.drawString(0,48,FrontSize.Size16X16,songName)
})
input.onButtonPressed(Button.B, function () {
    makerbit.runMp3Command(Mp3Command.PLAY_PREVIOUS_TRACK)
    songName = makerbit.mp3TrackShortName()
    OLED.drawString(0,48,FrontSize.Size16X16,songName)
})
*/
//makerbit.playMp3Track("0","1234")
//makerbit.runMp3Command(Mp3Command.PLAY)
//makerbit.runMp3Command(Mp3Command.PLAY_NEXT_TRACK)
//control.inBackground(function () {
//    makerbit.playMp3Track("0","1234")
//    basic.showString(makerbit.mp3TrackShortName())        
//    makerbit.mp3TrackShortName()

//})
OLED.drawNumber32X16(16, 0, 2, Hour)
OLED.drawString(48, 0, FrontSize.Size32X32, ":")
OLED.drawNumber32X16(64, 0, 2, Minute)
OLED.drawNumber16X8(102, 12, 2, second)
basic.forever(function () {
    second = second + 1
    if (second >= 60)
    {
        second = 0
        Minute = Minute + 1
        if (Minute >= 60)
        {
            Minute = 0
            Hour = Hour + 1
            if (Hour >= 24)
            {
                Hour = 0
            } 
            OLED.drawNumber32X16(16, 0, 2, Hour)
        }    
        OLED.drawNumber32X16(64, 0, 2, Minute)  
    }
    OLED.drawNumber16X8(102, 12, 2, second)
        

    songName = makerbit.mp3TrackShortName()

    if (songName != songName_Old)
    {
        songName_Old = songName
        OLED.drawString(0, 48, FrontSize.Size16X16, songName)
        for (let i = songName.length; i < 12; i++) {
            OLED.drawString(i*8, 48, FrontSize.Size16X16, " ") 
        }
            
    //    OLED.drawNumber16X8(0, 48, 0, songName_Old.length)
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
                OLED.drawIcon(104,48,OledIcon.play)
            }  
            else {
                status = 0
                makerbit.runMp3Command(Mp3Command.PAUSE)
                OLED.drawIcon(104,48,OledIcon.pause)
            }
        }

        if (makerbit.isIrButtonPressed(IrButton.Up)) {
            makerbit.runMp3Command(Mp3Command.INCREASE_VOLUME)
            OLED.drawNumber16X8(96,32,2,makerbit.mp3Volume())
        }
        if (makerbit.isIrButtonPressed(IrButton.Down)) {
            makerbit.runMp3Command(Mp3Command.DECREASE_VOLUME)
            OLED.drawNumber16X8(96,32,2,makerbit.mp3Volume())
        }
        if (makerbit.isIrButtonPressed(IrButton.Star)) {
            if (playmode == Mp3PLAYMODE.SINGLE_ONCE)
            {
                playmode = Mp3PLAYMODE.ALL_REPEAT
                OLED.drawString(0, 32, FrontSize.Size16X16, "LOOP")
            }    
            else
            {
                playmode = Mp3PLAYMODE.SINGLE_ONCE
                OLED.drawString(0, 32, FrontSize.Size16X16, "ONCE")
            }
            makerbit.setMp3Mode(playmode)
        }

    }
})

