const enum FrontSize {
    //% block="小字体"
    Size16X16 = 0,
    //% block="大字体"
    Size32X32 = 1,
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
    //% block="draw char OLED with coordinates |x轴 %x|y轴 %y| %size| 显示内容: %text"
    //% shim=OLED::drawChar
    export function drawChar(x:number,y:number,size:FrontSize, text: string): void {
        return;
    }


    /**
     * draws a line
     */
    //% blockId=drawString
    //% block="draw char OLED with coordinates |x轴 %x|y轴 %y| %size| 显示内容: %text"
     //% shim=OLED::drawString
    //% x.min=0 x.max=127 x.defl=0
    //% y.min=0 y.max=63 y.defl=0   
    export function drawString(x: number, y: number, size: FrontSize, text: string): void {
        return;
    }
    /**
     * draws a line
     */
    //% blockId=drawNumber32X16
    //% block="draw char OLED with coordinates |x轴 %x|y轴 %y| %size| 显示内容: %data"
     //% shim=OLED::drawNumber32X16
    //% x.min=0 x.max=127 x.defl=0
    //% y.min=0 y.max=63 y.defl=0   
    export function drawNumber32X16(x: number, y: number, xZero :number,data: number): void {
        return;
    }
    /**
     * draws a line
     */
    //% blockId=drawNumber16X8
    //% block="draw char OLED with coordinates |x轴 %x|y轴 %y| %size| 显示内容: %data"
     //% shim=OLED::drawNumber16X8
    //% x.min=0 x.max=127 x.defl=0
    //% y.min=0 y.max=63 y.defl=0   
    export function drawNumber16X8(x: number, y: number, xZero :number,data: number): void {
        return;
    }
}
