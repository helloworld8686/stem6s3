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
All text above, and the splash screen below must be included in any redistribution
*********************************************************************/



#include "mbed.h"
#include "Adafruit_SSD1325.h"
#include "glcdfont.h"

DigitalOut OLED_RST(MICROBIT_PIN_P14);
DigitalOut OLED_CS(MICROBIT_PIN_P13);
DigitalOut OLED_DC(MICROBIT_PIN_P16);
DigitalOut OLED_SDIN(MICROBIT_PIN_P15);
DigitalOut OLED_SCLK(MICROBIT_PIN_P2);


void Adafruit_SSD1325::begin(void) {

  wait_us(10000);
  OLED_RST = 1;
  wait_us(100000);
  OLED_RST = 0;
  wait_us(100000);
  OLED_RST = 1;

  //Serial.println("reset");
  wait_us(500);
  command(SSD1325_DISPLAYOFF); /* display off */
  

  command(SSD1325_SETCLOCK); /* set osc division */
  command(0xF1); /* 145 */
  command(SSD1325_SETMULTIPLEX ); /* multiplex ratio */
  command(0x3f); /* duty = 1/64 */
  command( SSD1325_SETOFFSET); /* set display offset --- */
  command(0x4C); /* 76 */
  command(SSD1325_SETSTARTLINE); /*set start line */
  command(0x00); /* ------ */
  command(SSD1325_MASTERCONFIG); /*Set Master Config DC/DC Converter*/
  command(0x02);
  command(SSD1325_SETREMAP); /* set segment remap------ */
  //command(0x56);
  command(0x52);
  //command(0x52);
  command(SSD1325_SETCURRENT + 0x2); /* Set Full Current Range */
  command(SSD1325_SETGRAYTABLE);
  command(0x01);
  command(0x11);
  command(0x22);
  command(0x32);
  command(0x43);
  command(0x54);
  command(0x65);
  command(0x76);

  command(SSD1325_SETCONTRAST); /* set contrast current */
  command(0x7F);  // max!
  
  command(SSD1325_SETROWPERIOD);
  command(0x51);
  command(SSD1325_SETPHASELEN);
  command(0x55);
  command(SSD1325_SETPRECHARGECOMP);
  command(0x02);
  command(SSD1325_SETPRECHARGECOMPENABLE);
  command(0x28);
  command(SSD1325_SETVCOMLEVEL); // Set High Voltage Level of COM Pin
  command(0x1C); //?
  command(SSD1325_SETVSL); // set Low Voltage Level of SEG Pin 
  command(0x0D|0x02);
  
  command(SSD1325_NORMALDISPLAY); /* set display mode */
  /* Clear Screen */  
 // command(0x23); /*set graphic acceleration commmand */
 // command(SSD1325_GFXACCEL);
 // command(SSD1325_DRAWRECT); /* draw rectangle */
 // command(0x00); /* Gray Scale Level 1 */
 // command(0x00); /* Gray Scale Level 3 & 2 */
 // command(0x3f); /* Gray Scale Level 3 & 2 */
 // command(0x3f); /* Gray Scale Level 3 & 2 */
 // command(0x00); /* Gray Scale Level 3 & 2 */

  command(SSD1325_DISPLAYON); /* display ON */
#if 0
  command(0x15); /* set column address */
  command(0x00); /* set column start address */
  command(128/2-1); /* set column end address */
  command(0x75); /* set row address */
  command(0x00); /* set row start address */
  command(64-1); /* set row end address */
  OLED_CS = 1;
  OLED_DC = 1;
  OLED_CS = 0;
  Delay_us(10);

  for (uint16_t x=0; x<128; x+=2) {
    for (uint16_t y=0; y<64; y+=8) { // we write 8 pixels at once
      uint8_t left8 = 0x00;
      uint8_t right8 = 0x00;
      for (uint8_t p=0; p<8; p++) {
        uint8_t d = 0;
        if (left8 & (1 << p)) d |= 0xF0;
        if (right8 & (1 << p)) d |= 0x0F;
        spixfer(d);
      }
    }
  }
  OLED_CS = 1;
#endif
}

void Adafruit_SSD1325::invertDisplay(uint8_t i) {
  if (i) {
    command(SSD1325_INVERTDISPLAY);
  } else {
    command(SSD1325_NORMALDISPLAY);
  }
}

void Adafruit_SSD1325::command(uint8_t c) {
  OLED_CS = 1;
  OLED_DC = 0;
  Delay_us(10);
  OLED_CS = 0;
  spixfer(c);
  OLED_CS = 1;
}

void Adafruit_SSD1325::data(uint8_t c) {
  OLED_CS = 1;
  OLED_DC = 1;
  Delay_us(10);
  OLED_CS = 0;
  spixfer(c);
  OLED_CS = 1;
}


void Adafruit_SSD1325::drawChar(int16_t t_x, int16_t t_y, unsigned char c, int color, int bg, int size)
{
  int16_t Front_LCDWIDTH;
  int16_t Front_LCDHEIGHT;
  uint8_t left8;
  if (color < 0)
  {
    color = 0;
  }
  else if (color > 0x0f)
  {
    color = 0x0f;
  }

  if (bg < 0)
  {
    bg = 0;
  }
  else if (bg > 0x0f)
  {
    bg = 0x0f;
  }

  if (((t_y<0)||(SSD1325_LCDHEIGHT<=t_y))||((t_x<0)||(SSD1325_LCDWIDTH<=t_x)))
  {
    return;
  }
  if (size == 1)
  {
    Front_LCDWIDTH = 16;
    Front_LCDHEIGHT = 32;
  }
  else
  {
    Front_LCDWIDTH = 8;
    Front_LCDHEIGHT = 16;
  }

  command(0x15); /* set column address */
  command(t_x/2); /* set column start address */
  command((t_x + Front_LCDWIDTH)/2-1); /* set column end address */
  command(0x75); /* set row address */
  command(t_y); /* set row start address */
  command(t_y + Front_LCDHEIGHT-1); /* set row end address */
  OLED_CS = 1;
  OLED_DC = 1;
  OLED_CS = 0;
  Delay_us(10);
  for (uint16_t x=0; x<Front_LCDHEIGHT; x++) {
    for (uint16_t y=0; y<Front_LCDWIDTH; y += 8) { // we write 8 pixels at once
      if (size == 1)
      {
        left8 = asc2_3216[c][(x * Front_LCDWIDTH + y) / 8];  
      }
      else
      {
        left8 = asc2_1608[c][(x * Front_LCDWIDTH + y) / 8];
      }
       
      for (uint8_t p=0; p<8; p+=2) {
        uint8_t d = 0;
        if (left8 & (0x80 >> p)) 
        {
          d |= (0xF0&(color<<4));
        }
        else
        {
          d |= (0xF0&(bg<<4));    
        }
                  
        if (left8 & (0x80 >> (p+1))) 
        {
          d |= (0x0F&color);
        }
        else
        {
          d |= (0x0F&bg);
        }
        
        spixfer(d);
      }
    }
  } 
  OLED_CS = 1;
}



void Adafruit_SSD1325::drawIcon(int16_t t_x, int16_t t_y, int32_t icon)
{
  int16_t Front_LCDWIDTH;
  int16_t Front_LCDHEIGHT;
  uint8_t data;

  Front_LCDWIDTH = 8;
  Front_LCDHEIGHT = 16;
  

  command(0x15); /* set column address */
  command(t_x/2); /* set column start address */
  command((t_x + Front_LCDWIDTH)/2-1); /* set column end address */
  command(0x75); /* set row address */
  command(t_y); /* set row start address */
  command(t_y + Front_LCDHEIGHT-1); /* set row end address */
  OLED_CS = 1;
  OLED_DC = 1;
  OLED_CS = 0;
  Delay_us(10);
  for (uint16_t x=0; x<Front_LCDHEIGHT; x++) {
    for (uint16_t y=0; y<Front_LCDWIDTH; y += 8) { // we write 8 pixels at once

      data = icon_1608[icon][(x * Front_LCDWIDTH + y) / 8];
       
      for (uint8_t p=0; p<8; p+=2) {
        uint8_t d = 0;
        if (data & (0x80 >> p)) {
          d |= 0xF0;
        }
                  
        if (data & (0x80 >> (p+1))) 
        {
          d |= 0x0F;
        }
 
        spixfer(d);
      }
    }
  } 
  OLED_CS = 1;
}




void Adafruit_SSD1325::display(void) {
  command(0x15); /* set column address */
  command(0x00); /* set column start address */
  command(FRONT_LCDWIDTH/2-1); /* set column end address */
  command(0x75); /* set row address */
  command(0x00); /* set row start address */
  command(FRONT_LCDHEIGHT-1); /* set row end address */
  OLED_CS = 1;
  OLED_DC = 1;
  OLED_CS = 0;
  Delay_us(10);
  for (uint16_t x=0; x<FRONT_LCDHEIGHT; x++) {
    for (uint16_t y=0; y<FRONT_LCDWIDTH; y += 8) { // we write 8 pixels at once
      uint8_t left8 = font[64+(x*FRONT_LCDWIDTH+y)/8];
      for (uint8_t p=0; p<8; p+=2) {
        uint8_t d = 0;
        if (left8 & (0x80 >> p)) d |= 0xF0;
        if (left8 & (0x80 >> (p+1))) d |= 0x0F;
        spixfer(d);
      }
    }
  }
  /* 
  for (uint16_t x=0; x<FRONT_LCDWIDTH; x+=2) {
    for (uint16_t y=0; y<FRONT_LCDWIDTH; y+=8) { // we write 8 pixels at once
      uint8_t left8 = font[32+y*FRONT_LCDHEIGHT/8+x];
      uint8_t right8 = font[32+y*FRONT_LCDHEIGHT/8+x+1];
      for (uint8_t p=0; p<8; p++) {
        uint8_t d = 0;
        if (left8 & (1 << p)) d |= 0xF0;
        if (right8 & (1 << p)) d |= 0x0F;
        spixfer(d);
      }
    }
  }*/
  OLED_CS = 1;

  #if 0
  command(0x15); /* set column address */
  command(0x00); /* set column start address */
  command(SSD1325_LCDWIDTH/2-1); /* set column end address */
  command(0x75); /* set row address */
  command(0x00); /* set row start address */
  command(SSD1325_LCDHEIGHT-1); /* set row end address */
  OLED_CS = 1;
  OLED_DC = 1;
  OLED_CS = 0;
  Delay_us(10);

  for (uint16_t x=0; x<SSD1325_LCDWIDTH; x+=2) {
    for (uint16_t y=0; y<SSD1325_LCDHEIGHT; y+=8) { // we write 8 pixels at once
      uint8_t left8 = buffer[y*SSD1325_LCDWIDTH/8+x];
      uint8_t right8 = buffer[y*SSD1325_LCDWIDTH/8+x+1];
      for (uint8_t p=0; p<8; p++) {
        uint8_t d = 0;
        if (left8 & (1 << p)) d |= 0xF0;
        if (right8 & (1 << p)) d |= 0x0F;
        spixfer(d);
      }
    }
  }
  OLED_CS = 1;
  #endif
}

// clear everything
void Adafruit_SSD1325::clearDisplay(void) {
  command(0x15); /* set column address */
  command(0x00); /* set column start address */
  command(SSD1325_LCDWIDTH/2-1); /* set column end address */
  command(0x75); /* set row address */
  command(0x00); /* set row start address */
  command(SSD1325_LCDHEIGHT-1); /* set row end address */
  OLED_CS = 1;
  OLED_DC = 1;
  OLED_CS = 0;
  Delay_us(10);

  for (uint16_t x=0; x<SSD1325_LCDHEIGHT; x++) {
    for (uint16_t y=0; y<SSD1325_LCDWIDTH; y+=8) { // we write 8 pixels at once
      for (uint8_t p=0; p<8; p+=2) {
        uint8_t d = 0;
        spixfer(d);
      }
    }
  }
  OLED_CS = 1;
}


void Adafruit_SSD1325::spixfer(uint8_t x) {
  uint8_t Data;
  Data = x;
  Delay_us(10);
  for (int i=0; i<8; i++)
  {
    OLED_SCLK=0;
    Delay_us(10);
    if (Data&0x80)
    {
      OLED_SDIN=1;
    }
    else
    {
      OLED_SDIN=0;
    }
    
    Data = Data << 1;
    Delay_us(10);
    OLED_SCLK=1;
    Delay_us(10);
  }
}


void Adafruit_SSD1325::Delay_us(int xus)
{

//  wait_us(xus);

  /*  
  int us_cnt = 0;
  for(int m = 0; m < xus; m++) 
  { 
     for(int k = 0; k < 5; k++)
    {
      us_cnt = us_cnt + 1;
    }    
  }	*/
}







