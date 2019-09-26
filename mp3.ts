// MakerBit Serial MP3 blocks supporting Catalex Serial MP3 1.0
/*
 1、两线串口路径支持中文和英文数字等组，建议文件夹名和文件名不要过长，一般建
议客户采用两个字符加*组合方式来。
2、如果文件夹或文件名带字母的，字母要求全部大写
3、注意格式前面没有点,注意后面三个问号和字母输入法要切换到英文
4、对应的指令可以由上位机来生成 

*/ 
const enum Mp3Repeat {
  //% block="once"
  No = 0,
  //% block="forever"
  Forever = 1
}

const enum Mp3Command {
  //% block="play next track"
  PLAY_NEXT_TRACK,
  //% block="play previous track"
  PLAY_PREVIOUS_TRACK,
  //% block="increase volume"
  INCREASE_VOLUME,
  //% block="decrease volume"
  DECREASE_VOLUME,
  //% block="暂停"
  PAUSE,
  //% block="播放"
  PLAY,
  //% block="停止"
  STOP
}
const enum Mp3PLAYMODE {
  //% block="全盘循环"
  ALL_REPEAT = 0,

  //% block="单曲循环"
  SINGLE_REPEAT = 1,
  //% block="单曲停止"
  SINGLE_ONCE = 2,  
  //% block="全盘随机"
  ALL_RANDOM = 3,

  //% block="目录循环"
  FOLDER_REPEAT = 4,
  //% block="目录随机"
  FOLDER_RANDOM = 5,
  //% block="目录顺序播放"
  FOLDER_ORDER = 6,
  //% block="顺序播放"
  ALL_ORDER = 7  
}  
const enum MP3LOCK{
  OFF = 0,
  ON = 1
}

const enum CommandCode {
  QUERY_STATUS = 0x01,
  PLAY_TRACK = 0x02,
  PAUSE = 0x03,
  STOP = 0x04,
  PLAY_PREV_TRACK = 0x05,
  PLAY_NEXT_TRACK = 0x06,
  PLAY_TRACK_INDEX = 0x07,
  PLAY_TRACK_FROM_FOLDER = 0x08,

  QUERY_ONLINE_DEVICE = 0x09,
  QUERY_CURRUNT_DEVICE = 0x0A,
  SELECT_DEVICE = 0x0B,

  QUERY_TOTAL_TRACK_COUNT = 0x0C,
  QUERY_TRACK = 0x0D,

  PLAY_PREV_FOLDER = 0x0E,
  PLAY_NEXT_FOLDER = 0x0F,


  STOP_CURRUNT_PLAY = 0x10,

  QUERY_FOLDER_TRACK_FIRST = 0x11,
  QUERY_FOLDER_TRACK_COUNT = 0x12,

  SET_VOLUME = 0x13,
  INCREASE_VOLUME = 0x14,
  DECREASE_VOLUME = 0x15,

  INSERT_PLAY_TRACK = 0x16,
  INSERT_PLAY_URL = 0x17,

  SET_MODE = 0x18,
  SET_LOOP_COUNT = 0x19,

  SET_EQ = 0x1A,

  QUERY_TRACK_SHORT_NAME = 0x1E,

}


namespace makerbit {


  interface DeviceState {
    Lock:MP3LOCK
    track: uint16;
    folder: uint8;
    string_track: string;
    string_folder:string;
    playMode: Mp3PLAYMODE;
    repeat: Mp3Repeat;
    maxTracksInFolder: uint8;
    volume: uint8;
    previousTrackCompletedResponse: int16;
    lastTrackEventValue: uint16;
    isPlaying: boolean;
    TrackShortName: string;
    TrackShortNameGet:boolean
  }

  let deviceState: DeviceState;

  const MICROBIT_MAKERBIT_MP3_TRACK_STARTED_ID = 756;
  const MICROBIT_MAKERBIT_MP3_TRACK_COMPLETED_ID = 757;

  function readSerial() {
    let len: number
    let checksum: number
    let cmd: number
    let data: Buffer
    const responseBuffer: Buffer = pins.createBuffer(15);
    while (true) {
    //  const first = serial.readBuffer(1);
    //  let string_l = serial.Read()
  //    OLED.drawNumber16X8(0,48,0,string_l)
     // control.waitMicros(2000*2000)
     // OLED.drawString(0,48,FrontSize.Size16X16,string_l)
      //if (false)
      if (false)
    //  if (first.getNumber(NumberFormat.UInt8LE, 0) == 0xAA)
      {
        let remainder = serial.readBuffer(1);
        cmd = remainder.getNumber(NumberFormat.UInt8LE, 0) 
        if (cmd == CommandCode.QUERY_TRACK_SHORT_NAME) { 
          remainder = serial.readBuffer(1);
          len = remainder.getNumber(NumberFormat.UInt8LE, 0)
          checksum = 0xaa + cmd + len
          if (len < 15)
          {    
            for (let i = 0; i < len; i++)
            {
                     
              responseBuffer.write(i, data);
              checksum = checksum + responseBuffer.getNumber(NumberFormat.UInt8LE, i)  
            }  
            checksum = checksum % 256
            remainder = serial.readBuffer(1)
          /*check sum */
            if (remainder.getNumber(NumberFormat.UInt8LE, 0) == checksum) { 
              deviceState.TrackShortName = responseBuffer.toString()           
              deviceState.TrackShortNameGet = true
              OLED.drawString(0,48,FrontSize.Size16X16,deviceState.TrackShortName)
            }  
          }
          else
          {
             
          }  

        }  
      //  responseBuffer.write(1, remainder);
      //  const response = YX5300.decodeResponse(responseBuffer);
       // handleResponse(response);
      }
      control.waitMicros(1000*100) 
      
    }
  }

  function handleResponse(response: YX5300.Response) {
    switch (response.type) {
      case YX5300.ResponseType.TRACK_NOT_FOUND:
        handleResponseTrackNotFound(response);
        break;
      case YX5300.ResponseType.TRACK_COMPLETED:
        handleResponseTrackCompleted(response);
        break;
      default:
        break;
    }
  }

  function handleResponseTrackNotFound(response: YX5300.Response) {
    if (!deviceState) {
      return;
    }

    deviceState.isPlaying = false;

    if (deviceState.track < deviceState.maxTracksInFolder) {
      deviceState.maxTracksInFolder = deviceState.track;
    }

    if (
      deviceState.track > 1 &&
      deviceState.repeat === Mp3Repeat.Forever
    ) {
      deviceState.track = 1;
      playTrackOnDevice(deviceState);
    }
  }

  function handleResponseTrackCompleted(response: YX5300.Response) {
    if (!deviceState) {
      return;
    }

    // At end of playback we receive up to two TRACK_COMPLETED events.
    // We use the 1st TRACK_COMPLETED event to notify playback as complete
    // or to advance folder play. A following 2nd event with same playload is ignored.
    if (deviceState.previousTrackCompletedResponse !== response.payload) {
      control.raiseEvent(
        MICROBIT_MAKERBIT_MP3_TRACK_COMPLETED_ID,
        deviceState.track
      );
      deviceState.lastTrackEventValue = deviceState.track;
      deviceState.isPlaying = false;
 //     if (deviceState.playMode === PlayMode.Folder)
      {
        deviceState.track++;
        playTrackOnDevice(deviceState);
      }

      deviceState.previousTrackCompletedResponse = response.payload;
    }
  }

  /**
   * Connects to the Serial MP3 device.
   * @param mp3RX MP3 device receiver pin (RX), eg: DigitalPin.P0
   * @param mp3TX MP3 device transmitter pin (TX), eg: DigitalPin.P1
   */
  //% subcategory="MP3"
  //% blockId="makerbit_mp3_connect" block="connect MP3 device with MP3 RX attached to %mp3RX | and MP3 TX to %mp3TX"
  //% mp3RX.fieldEditor="gridpicker" mp3RX.fieldOptions.columns=3
  //% mp3RX.fieldOptions.tooltips="false"
  //% mp3TX.fieldEditor="gridpicker" mp3TX.fieldOptions.columns=3
  //% mp3TX.fieldOptions.tooltips="false"
  //% weight=50
  export function connectSerialMp3(mp3RX: DigitalPin, mp3TX: DigitalPin): void {
    serial.redirect(mp3RX as number, mp3TX as number, BaudRate.BaudRate9600);
    serial.writeNumber(0)
  //  control.inBackground(readSerial);
  //  sendCommand(YX5300.selectDeviceTfCard());
    control.waitMicros(500 * 1000);
  //  setMp3Volume(30);
    deviceState = {
      Lock:MP3LOCK.ON,
      track: 1,
      folder: 1,
      string_track: "",
      string_folder:"",
      playMode: Mp3PLAYMODE.ALL_REPEAT,
      repeat: Mp3Repeat.No,
      maxTracksInFolder: YX5300.MAX_TRACKS_PER_FOLDER,
      volume: 30,
      previousTrackCompletedResponse: -1,
      lastTrackEventValue: 0,
      isPlaying: false,
      TrackShortName: "",
      TrackShortNameGet: false
    };
  }

  /**
   * Plays a track from a folder and waits for completion.
   */
  //% subcategory="MP3"
  //% blockId="makerbit_mp3_play_track" block="play MP3 track %track | from folder %folder and wait for completion"
  //% weight=49
  export function playMp3Track(track: string, folder: string): void {
    if (!deviceState) {
      return;
    }

    playMp3TrackFromFolder(track, folder);
   /* while (deviceState.isPlaying) {
      basic.pause(250);
    }*/
  }

  /**
   * Plays a track from a folder.
   * @param track track index, eg:1
   * @param folder folder index, eg:1
   */
  //% subcategory="MP3"
  //% blockId="makerbit_mp3_play_track_from_folder" block="play MP3 track %track | from folder %folder | %repeat"
  //% track.min=1 track.max=255
  //% folder.min=1 folder.max=99
  //% weight=48
  function playMp3TrackFromFolder(
    track: string,
    folder: string,
  ): void {
    if (!deviceState) {
      return;
    }
    deviceState.string_folder = folder;
    deviceState.string_track = track;
    deviceState.maxTracksInFolder = YX5300.MAX_TRACKS_PER_FOLDER;
    playTrackOnDevice(deviceState);
  }


  function playTrackOnDevice(targetState: DeviceState): void {
    deviceState.previousTrackCompletedResponse = -1;
    
    sendCommand(YX5300.playTrackFromFolder(deviceState.string_track, deviceState.string_folder));

    control.raiseEvent(
      MICROBIT_MAKERBIT_MP3_TRACK_STARTED_ID,
      deviceState.track
    );
    deviceState.isPlaying = true;
    deviceState.lastTrackEventValue = deviceState.track;
  }

  /**
   * Sets the Mode.
   * @param mode : eg: Mp3PLAYMODE.ALL_REPEAT
   */
  //% subcategory="MP3"
  //% blockId="setMp3Mode" 
  //% block="set MP3 Mode to %mode"
  //% weight=46
  export function setMp3Mode(mode: Mp3PLAYMODE): void {
    if (!deviceState) {
      return;
    }

    if (mode < Mp3PLAYMODE.ALL_REPEAT || mode > Mp3PLAYMODE.ALL_ORDER) {
      return;
    }
    deviceState.playMode = mode;
    sendCommand(YX5300.setMode(mode));
  }

  /**
   * Sets the volume.
   * @param volume volume in the range of 0 to 30: eg: 30
   */
  //% subcategory="MP3"
  //% blockId="makerbit_mp3_set_volume" block="set MP3 volume to %volume"
  //% volume.min=0 volume.max=30
  //% weight=46
  export function setMp3Volume(volume: number): void {
    if (!deviceState) {
      return;
    }

    if (volume < 0 || volume > 30) {
      return;
    }
    deviceState.volume = volume;
    sendCommand(YX5300.setVolume(volume));
  }
  /**
   * Dispatches a command to the MP3 device.
   * @param command command, eg: Mp3Command.PLAY_NEXT_TRACK
   */
  //% subcategory="MP3"
  //% blockId="makerbit_mp3_run_command"
  //% block="MP3 %command"
  //% weight=45
  export function runMp3Command(command: Mp3Command): void {
    if (!deviceState) {
      return;
    }

    switch (command) {
      case Mp3Command.PLAY_NEXT_TRACK:
        sendCommand(YX5300.next())
        break;
      case Mp3Command.PLAY_PREVIOUS_TRACK:
        sendCommand(YX5300.previous())
        break;
      case Mp3Command.INCREASE_VOLUME:
        setMp3Volume(deviceState.volume + 1);
        break;
      case Mp3Command.DECREASE_VOLUME:
        setMp3Volume(deviceState.volume - 1);
        break;
      case Mp3Command.PAUSE:
        sendCommand(YX5300.pause());
        break;

      case Mp3Command.STOP:
        deviceState.isPlaying = false;
        sendCommand(YX5300.stop());
        break;
      case Mp3Command.PLAY:
        deviceState.isPlaying = true;
        sendCommand(YX5300.play());
        break;   
    }
  }
  let responseBuffer: Buffer;
  /**
   * Returns mp3 track short name.
   */
  //% subcategory="MP3"
  //% blockId="mp3TrackShortName"
  //% block="MP3 Track short name"
  //% weight=40
  export function mp3TrackShortName(): string {
    let err: string = "err"
    let len = 0
    let checksum = 0

    let uartdata
    if (!responseBuffer) 
      responseBuffer = pins.createBuffer(20);

  //  deviceState.TrackShortNameGet = false
    while (true)
    {
      if (serial_user.Read().length == 0)
        break
    }  
    sendCommand(YX5300.queryTrackName());

    let dat = serial_user.Read()
    if (dat.length > 0)
    {
      if  ((dat.getNumber(NumberFormat.UInt8LE, 0) == 0xAA) && (dat.getNumber(NumberFormat.UInt8LE, 1) == CommandCode.QUERY_TRACK_SHORT_NAME)) 
      { 
        len = dat.getNumber(NumberFormat.UInt8LE, 2)
        checksum = 0xaa + CommandCode.QUERY_TRACK_SHORT_NAME + len
        if (len < 15)
        {
          
          for (let i = 0; i < len; i++) {
            uartdata = dat.getNumber(NumberFormat.UInt8LE, i+3)
            responseBuffer.setNumber(NumberFormat.UInt8LE, i, uartdata);
            checksum = checksum + uartdata
          }
          responseBuffer.setNumber(NumberFormat.UInt8LE, len, 0);

          checksum = checksum % 256
          uartdata = dat.getNumber(NumberFormat.UInt8LE, len + 3)

          if (uartdata == checksum) 
          {
            deviceState.TrackShortName = responseBuffer.slice(0, 8).toString()
            len = deviceState.TrackShortName.indexOf(" ")
            if (len > 0) {
              deviceState.TrackShortName = deviceState.TrackShortName.substr(0,len)          
            }          
            deviceState.TrackShortName = deviceState.TrackShortName+".mp3"
            return deviceState.TrackShortName
          }  
        }  
      }
    }  
    
    return "";  
  }
  

  function sendCommand(command: Buffer): void {
    serial.writeBuffer(command);
    basic.pause(YX5300.REQUIRED_PAUSE_BETWEEN_COMMANDS_MILLIS)
  }


  /**
   * Returns the index of the selected MP3 folder.
   */
  //% subcategory="MP3"
  //% blockId="makerbit_mp3_folder"
  //% block="MP3 folder"
  //% weight=40
  export function mp3Folder(): number {
    return deviceState ? deviceState.folder : 1;
  }

  /**
   * Returns the MP3 volume.
   */
  //% subcategory="MP3"
  //% blockId="makerbit_mp3_volume"
  //% block="MP3 volume"
  //% weight=38
  export function mp3Volume(): number {
    return deviceState ? deviceState.volume : 30;
  }
  /**
   * Returns the MP3 mode.
   */
  //% subcategory="MP3"
  //% blockId="mp3Mode"
  //% block="MP3 mode"
  //% weight=38
  export function mp3Mode(): number {
    if (deviceState.playMode < Mp3PLAYMODE.ALL_REPEAT || deviceState.playMode > Mp3PLAYMODE.ALL_ORDER) {
      return Mp3PLAYMODE.ALL_REPEAT;
    }
    return deviceState.playMode
  }  

  // YX5300 asynchronous serial port control commands
  export namespace YX5300 {
    export interface Response {
      type: ResponseType;
      payload?: number;
    }

    export const REQUIRED_PAUSE_BETWEEN_COMMANDS_MILLIS = 300;
    export const MAX_TRACKS_PER_FOLDER = 255;



    export const enum ResponseType {
      RESPONSE_INVALID = 0x00,
      RESPONSE_START_BYTE = 0xAA,
      TF_CARD_INSERT = 0x3a,
      TRACK_COMPLETED = 0x3d,
      TRACK_NOT_FOUND = 0x40,
      ACK = 0x41,
      PLAYBACK_STATUS = 0x42,
      VOLUME = 0x43,
      CURRENT_TRACK = 0x4c,
      FOLDER_TRACK_COUNT = 0x4e,
      FOLDER_COUNT = 0x4f
    }

    let commandBuffer: Buffer;
    let commandBuffer_tX: Buffer;
    export function composeSerialCommand(
      command: CommandCode,
      dataHigh: number,
      dataLow: number
    ): Buffer {
      let data
      let len =  0
      if (!commandBuffer) {
        commandBuffer = pins.createBuffer(8);
        commandBuffer.setNumber(NumberFormat.UInt8LE, 0, 0xAA);
      }
      commandBuffer.setNumber(NumberFormat.UInt8LE, 1, command); 
      switch (command) { 
        case CommandCode.PLAY_TRACK_INDEX:
          len = 2
          break
        case CommandCode.SELECT_DEVICE:
        case CommandCode.SET_VOLUME:  
        case CommandCode.SET_MODE:  
          len = 1
          break          
        default:
          break
      }
      commandBuffer.setNumber(NumberFormat.UInt8LE, 2, len);
      data = 0xAA + command + len
      if (len == 2) {
        commandBuffer.setNumber(NumberFormat.UInt8LE, 3, dataHigh);
        commandBuffer.setNumber(NumberFormat.UInt8LE, 4, dataLow); 
        data = data + dataHigh + dataLow     
      }
      else if (len == 1) {
        commandBuffer.setNumber(NumberFormat.UInt8LE, 3, dataLow);  
        data = data + dataLow
      }

        
      commandBuffer.setNumber(NumberFormat.UInt8LE, (len + 3), data);
      commandBuffer_tX = commandBuffer.slice(0,(4+len))
      return commandBuffer_tX;
    }
    let commandBuffer_String: Buffer;
    let commandBuffer_String_tX: Buffer; 
    export function composeSerialCommand_TrackFolder (     
    command: CommandCode,
    track: string,
    folder: string
    ): Buffer {
      let data
      let len = 0
      let tempstring: string
      if (folder.length == 0)
      {
        tempstring = "/" + track + "*???"
      } 
      else
      {
        tempstring = "/" + folder + "*/" + track + "*???"
      }  

      if (!commandBuffer_String) {
        commandBuffer_String = pins.createBuffer(20);
        commandBuffer_String.setNumber(NumberFormat.UInt8LE, 0, 0xAA);
      }
      commandBuffer_String.setNumber(NumberFormat.UInt8LE, 1, command); 
      if (len > 45)
      {
        len = 45;
      }  
      len = tempstring.length + 0x01
      commandBuffer_String.setNumber(NumberFormat.UInt8LE, 2, len)


      commandBuffer_String.setNumber(NumberFormat.UInt8LE, 3, 0x01);      

      data = 0xAA  + command + len + 0x01
      for (let i = 0; i < tempstring.length; i++)
      {
        commandBuffer_String.setNumber(NumberFormat.UInt8LE, 4 + i, tempstring.charCodeAt(i))
        data = data + tempstring.charCodeAt(i)
      }  


      commandBuffer_String.setNumber(NumberFormat.UInt8LE, (len + 3), data);
      commandBuffer_String_tX = commandBuffer_String.slice(0, (4 + len));
      return commandBuffer_String_tX;
    }
  


    export function next(): Buffer {
      return composeSerialCommand(CommandCode.PLAY_NEXT_TRACK, 0x00, 0x00);
    }

    export function previous(): Buffer {
      return composeSerialCommand(CommandCode.PLAY_PREV_TRACK, 0x00, 0x00);
    }

    export function playTrack(track: number): Buffer {
      return composeSerialCommand(CommandCode.PLAY_TRACK, 0x00, track);
    }

    export function increaseVolume(): Buffer {
      return composeSerialCommand(CommandCode.INCREASE_VOLUME, 0x00, 0x00);
    }

    export function decreaseVolume(): Buffer {
      return composeSerialCommand(CommandCode.DECREASE_VOLUME, 0x00, 0x00);
    }

    export function setVolume(volume: number): Buffer {
      const clippedVolume = Math.min(Math.max(volume, 0), 30);
      return composeSerialCommand(CommandCode.SET_VOLUME, 0x00, clippedVolume);
    }

    export function setMode(mode: Mp3PLAYMODE): Buffer {
      return composeSerialCommand(CommandCode.SET_MODE, 0x00, mode);
    }
    export function selectDeviceTfCard(): Buffer {
      return composeSerialCommand(CommandCode.SELECT_DEVICE, 0x00, 0x01);
    }

    export function pause(): Buffer {
      return composeSerialCommand(CommandCode.PAUSE, 0x00, 0x00);
    }

    export function playTrackFromFolder(track: string, folder: string): Buffer {
      return composeSerialCommand_TrackFolder(
        CommandCode.PLAY_TRACK_FROM_FOLDER,
        track,
        folder
      );
    }

    export function queryStatus(): Buffer {
      return composeSerialCommand(CommandCode.QUERY_STATUS, 0x00, 0x00);
    }
/*
    export function queryVolume(): Buffer {
      return composeSerialCommand(CommandCode.QUERY_VOLUME, 0x00, 0x00);
    }*/

    export function queryTrack(): Buffer {
      return composeSerialCommand(CommandCode.QUERY_TRACK, 0x00, 0x00);
    }

    export function queryFolderTrackCount(folder: number): Buffer {
      return composeSerialCommand(
        CommandCode.QUERY_FOLDER_TRACK_COUNT,
        0x00,
        folder
      );
    }
    /*
    export function queryFolderCount(): Buffer {
      return composeSerialCommand(CommandCode.QUERY_FOLDER_COUNT, 0x00, 0x00);
    }*/

    export function stop(): Buffer {
      return composeSerialCommand(CommandCode.STOP, 0x00, 0x00);
    }

    export function play(): Buffer {
      return composeSerialCommand(CommandCode.PLAY_TRACK, 0x00, 0x00);
    }

    export function queryTrackName(): Buffer{
      return composeSerialCommand(CommandCode.QUERY_TRACK_SHORT_NAME, 0x00, 0x00);    
    }


    export function decodeResponse(response: Buffer): Response {
      if (response.length != 10) {
        return { type: ResponseType.RESPONSE_INVALID };
      }

      if (response.getNumber(NumberFormat.UInt8LE, 0) != 0x7e) {
        return { type: ResponseType.RESPONSE_INVALID };
      }

      if (response.getNumber(NumberFormat.UInt8LE, 9) != 0xef) {
        return { type: ResponseType.RESPONSE_INVALID };
      }

      const type = response.getNumber(NumberFormat.UInt8LE, 3);
      const payload =
        (response.getNumber(NumberFormat.UInt8LE, 5) << 8) |
        response.getNumber(NumberFormat.UInt8LE, 6);

      return { type: type, payload: payload };
    }
  }
}
