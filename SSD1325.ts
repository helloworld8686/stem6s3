const enum FrontSize {
    //% block="小字体"
    Size16X16 = 0,
    //% block="大字体"
    Size32X32 = 1,
}


const enum OledIcon{
    //% block="播放"
    play = 0,
    //% block="暂停"
    pause = 1,
    //% block="下一首"
    next = 2,
}

//% color=#27b0ba weight=100 icon="\uf26c"
namespace OLED {

    /**
     * initialises the i2c OLED display
     */
    //% blockId=oled_init_terminal
    //% weight=100
    //% block="initialize OLED with height"
    //% icon="\uf1ec" 
    //% shim=OLED::init_terminal
    export function init(): void {
        return;
    }


    /**
     * clears the screen.
     */
    //% blockId=oled_clear_screen
    //% block="clear OLED display"
    //% icon="\uf1ec" 
    //% shim=OLED::clearDisplay
    export function clear(): void {
        return;
    }
  
    /**
     * draws a line
     */
    //% blockId=drawChar
    //% block="Oled显示字符 |x轴 %x|y轴 %y| %size| 显示内容: %text"
    //% shim=OLED::drawChar
    function drawChar(x:number,y:number,size:FrontSize, text: string): void {
        return;
    }


    /**
     * draws a string
     */
    //% blockId=drawString
    //% block="Oled显示字符串 |x轴 %x|y轴 %y| 字体大小: %size | 显示字符串: %text"
     //% shim=OLED::drawString
    //% x.min=0 x.max=127 x.defl=0
    //% y.min=0 y.max=63 y.defl=0   
    export function drawString(x: number, y: number, size: FrontSize, text: string): void {
        return;
    }
    /**
     * draws a big size of number
     */
    //% blockId=drawNumber32X16
    //% block="Oled显示大字体数字 |x轴 %x|y轴 %y| 用0补齐的位数: %xZero| 显示数字: %data"
     //% shim=OLED::drawNumber32X16
    //% x.min=0 x.max=127 x.defl=0
    //% y.min=0 y.max=63 y.defl=0   
    //% xZero.min = 0 xZero.max=9 xZero.defl=0 
    export function drawNumber32X16(x: number, y: number, xZero :number,data: number): void {
        return;
    }
    /**
     * draws a number
     */
    //% blockId=drawNumber16X8
    //% block="Oled显示小字体数字|x轴 %x|y轴 %y| 用0补齐的位数: %xZero| 显示数字: %data"
     //% shim=OLED::drawNumber16X8
    //% x.min=0 x.max=127 x.defl=0
    //% y.min=0 y.max=63 y.defl=0   
    //% xZero.min = 0 xZero.max=9 xZero.defl=0  
    export function drawNumber16X8(x: number, y: number, xZero :number,data: number): void {
        return;
    }



    /**
     * draws a number
     */
    //% blockId=drawIcon
    //% block="Oled显示图标|x轴 %x|y轴 %y| 选择图标: %icon"
    //% shim=OLED::drawIcon 
    export function drawIcon(x: number, y: number, icon :OledIcon): void {
        return;
    }

    /**
     * Char width
     */
    //% blockId=CharWidth
    //% block="%size 字符的宽度"

    export function CharWidth(size: FrontSize): number {
        if (size == FrontSize.Size32X32)
        {
            return 16;
        }   
        else
        {
            return 8;
        }  
    }


    /**
     * Char Height
     */
    //% blockId=CharHeight
    //% block="%size 字符的高度 "

    export function CharHeight(size: FrontSize): number {
        if (size == FrontSize.Size32X32)
        {
            return 32;
        }   
        else
        {
            return 16;
        }    
    }
}
