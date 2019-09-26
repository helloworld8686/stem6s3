/*********************************************************************
This is a library for our Monochrome OLEDs based on SSD1325 drivers

  Pick one up today in the adafruit shop!
  ------> http://www.adafruit.com/category/63_98

These displays use SPI to communicate, 4 or 5 pins are required to  
interface

Adafruit invests time and resources providing this open source code, 
please support Adafruit and open-source hardware by purchasing 
products from Adafruit!

Written by Limor Fried/Ladyada  for Adafruit Industries.  
BSD license, check license.txt for more information
All text above, and the splash screen must be included in any redistribution
*********************************************************************/
#ifndef _ADAFRUIT_SSD1325_H_
#define _ADAFRUIT_SSD1325_H_

#include "MicroBitPin.h"
#include "mbed.h"
#include "typeDef.h"

#include "mbed.h"
#include "MicroBit.h"


#include <vector>
#include <algorithm>


#ifdef __arm__
#ifndef _BV
#define _BV(b) (1<<(b))
#endif
#endif




#ifndef adagfx_swap
#define adagfx_swap(a, b) { uint8_t t = a; a = b; b = t; }
#endif

#define BLACK 0
#define WHITE 1

/*=========================================================================
    SSD1325 Displays
    -----------------------------------------------------------------------
    The driver is used in multiple displays (128x64, 128x32, etc.).
    Select the appropriate display below to create an appropriately
    sized framebuffer, etc.

    SSD1325_128_64  128x64 pixel display

    SSD1325_128_32  128x32 pixel display

    You also need to set the LCDWIDTH and LCDHEIGHT defines to an 
    appropriate size

    -----------------------------------------------------------------------*/
#define SSD1325_128_64
/*=========================================================================*/

#if defined SSD1325_128_64 && defined SSD1325_128_32
  #error "Only one SSD1325 display can be specified at once in SSD1325.h"
#endif
#if !defined SSD1325_128_64 && !defined SSD1325_128_32
  #error "At least one SSD1325 display must be specified in SSD1325.h"
#endif

#if defined SSD1325_128_64
  #define SSD1325_LCDWIDTH                  128
  #define SSD1325_LCDHEIGHT                 64
#endif
#if defined SSD1325_128_32
  #define SSD1325_LCDWIDTH                  32
  #define SSD1325_LCDHEIGHT                 32
#endif

#define  FRONT_LCDWIDTH     16
#define  FRONT_LCDHEIGHT    16


#define SSD1325_SETCOLADDR 0x15
#define SSD1325_SETROWADDR 0x75
#define SSD1325_SETCONTRAST 0x81
#define SSD1325_SETCURRENT 0x84

#define SSD1325_SETREMAP 0xA0
#define SSD1325_SETSTARTLINE 0xA1
#define SSD1325_SETOFFSET 0xA2
#define SSD1325_NORMALDISPLAY 0xA4
#define SSD1325_DISPLAYALLON 0xA5
#define SSD1325_DISPLAYALLOFF 0xA6
#define SSD1325_INVERTDISPLAY 0xA7
#define SSD1325_SETMULTIPLEX 0xA8
#define SSD1325_MASTERCONFIG 0xAD
#define SSD1325_DISPLAYOFF 0xAE
#define SSD1325_DISPLAYON 0xAF

#define SSD1325_SETPRECHARGECOMPENABLE 0xB0
#define SSD1325_SETPHASELEN 0xB1
#define SSD1325_SETROWPERIOD 0xB2
#define SSD1325_SETCLOCK 0xB3
#define SSD1325_SETPRECHARGECOMP 0xB4
#define SSD1325_SETGRAYTABLE 0xB8
#define SSD1325_SETPRECHARGEVOLTAGE 0xBC
#define SSD1325_SETVCOMLEVEL 0xBE
#define SSD1325_SETVSL 0xBF

#define SSD1325_GFXACCEL 0x23
#define SSD1325_DRAWRECT 0x24
#define SSD1325_COPY 0x25




class Adafruit_SSD1325{
 public:

  void begin(void);
  void command(uint8_t c);
  void data(uint8_t c);

  void clearDisplay(void);
  void invertDisplay(uint8_t i);
  void setBrightness(uint8_t i);
  void display();

  void drawChar(int16_t t_x, int16_t t_y, unsigned char c, int color, int bg, int size);
  void drawIcon(int16_t t_x, int16_t t_y, int32_t icon);
  void drawPixel(int16_t x, int16_t y, uint16_t color);
  void shiftDisplay(int16_t dx, int16_t dy);

private:
  int8_t sid, sclk, dc, rst, cs;
  void spixfer(uint8_t x);
  void Delay_us(int xus);
};
#endif