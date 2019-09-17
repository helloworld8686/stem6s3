#include "pxt.h"
#include "Adafruit_SSD1325.h"

using namespace pxt;

namespace OLED {
	#define SSD1325_ADDRESS 0x78
	#undef printf

	Adafruit_SSD1325 *oled;

	//%
	void init_terminal(){

		if (oled != NULL) delete oled;
		
		oled = new Adafruit_SSD1325();
		oled->begin();	
		oled->clearDisplay();
	//	oled->display();		
	//	oled->setTextCursor(0, 0);
	}
	//%
	void drawChar(int x0, int y0, int size, String text){
		oled->drawChar(x0, y0, text->ascii.data[0]- 0x20, 15, 0,size);
	}
	//%
	void drawString(int x0, int y0, int size, String text){
		int x;
		int y;
		int Front_LCDWIDTH;
		int Front_LCDHEIGHT;
		x = x0;
		y = y0;
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

		for (int i = 0; i < text->ascii.length; i++)
		{
			oled->drawChar(x, y, text->ascii.data[i]- 0x20, 15, 0,size);
			x += Front_LCDWIDTH;
			if ((x+Front_LCDWIDTH) > 128)
			{
				x = 0;
				y += Front_LCDHEIGHT;
				if ((y+Front_LCDHEIGHT) > 64)
				{
					break;
				}
			}
		}
	}	

	//%
	void drawNumber32X16(int x0, int y0, int xZero, int data){
		int x;
		int y;
		int Front_LCDWIDTH;
		int Front_LCDHEIGHT;
		int tdata = data;
		uint8_t buf[10];
		uint8_t len = 0;
		x = x0;
		y = y0;
		for (int i = 0; i<10; i++)
		{
			buf[i] = tdata % 10+0x30;
			tdata /= 10;
			len++;

			if (tdata == 0)
			{		
				if (xZero == 0)
				{
					break;
				}

				if (i>=(xZero-1))
				{
					break;	
				}	
			}
		}


		Front_LCDWIDTH = 16;
		Front_LCDHEIGHT = 32;


		for (int i = 0; i < len; i++)
		{

			oled->drawChar(x, y, buf[(len-1)-i]- 0x20, 15, 0,1);
			x += Front_LCDWIDTH;
			if ((x+Front_LCDWIDTH) > 128)
			{
				x = 0;
				y += Front_LCDHEIGHT;
				if ((y+Front_LCDHEIGHT) > 64)
				{
					break;
				}
			}
		}
	}	


	//%
	void drawNumber16X8(int x0, int y0, int xZero, int data){
		int x;
		int y;
		int Front_LCDWIDTH;
		int Front_LCDHEIGHT;
		int tdata = data;
		uint8_t buf[10];
		uint8_t len = 0;
		x = x0;
		y = y0;
		for (int i = 0; i<10; i++)
		{
			buf[i] = tdata % 10+0x30;
			tdata /= 10;
			len++;

			if (tdata == 0)
			{		
				if (xZero == 0)
				{
					break;
				}

				if (i>=(xZero-1))
				{
					break;	
				}	
			}
		}


		Front_LCDWIDTH = 8;
		Front_LCDHEIGHT = 16;


		for (int i = 0; i < len; i++)
		{

			oled->drawChar(x, y, buf[(len-1)-i]- 0x20, 15, 0,0);
			x += Front_LCDWIDTH;
			if ((x+Front_LCDWIDTH) > 128)
			{
				x = 0;
				y += Front_LCDHEIGHT;
				if ((y+Front_LCDHEIGHT) > 64)
				{
					break;
				}
			}
		}
	}
#if 0 
	//%
    void showStringNoNewLine(String text) {
		
	//	oled->printf("%s", PXT_BUFFER_DATA(text));
		oled->display();
    }	


	

	//%
    void showStringNoNewLine(String text) {
		
	//	oled->printf("%s", PXT_BUFFER_DATA(text));
		oled->display();
    }

	//%
    void showStringWithNewLine(String text) {
		tesxt->data[0];
		//	oled->printf("%s\n", PXT_BUFFER_DATA(text));
		oled->display();
    }
	
    //%
    void showNumberWithoutNewLine (int number) {
		oled->printf("%d", number);
		oled->display();
	}
	
	//%
    void showNumberWithNewLine (int number) {
		oled->printf("%d\n", number);
		oled->display();
	}
	
    //%
    void NextLine () {
		oled->printf("\n");
		oled->display();
	}

	//%
	void clearDisplay(){
		oled->setTextCursor(0, 0);
		oled->clearDisplay();
		oled->display();
	}
	
	//%
	void drawCircle(int x, int y, int r){
		oled->drawCircle(x, y, r, 1);
		oled->display();
	}

	//%
	void fillCircle(int x, int y, int r){
		oled->fillCircle(x, y, r, 1);
		oled->display();
	}

	//%
	void drawLine(int x0, int y0, int x1, int y1){
		oled->drawLine(x0, y0, x1, y1, 1);
		oled->display();
	}

	//%
	void fillRect(int x, int y, int w, int h){
		oled->fillRect(x, y, w, h, 1);
		oled->display();
	}

	//%
    void drawRect(int x, int y, int w, int h){
    	oled->drawRect(x, y, w, h, 1);
		oled->display();
    }

    //%
	void fillRoundRect(int x, int y, int w, int h, int r){
		oled->fillRoundRect(x, y, w, h, r, 1);
		oled->display();
	}

	//%
    void drawRoundRect(int x, int y, int w, int h, int r){
    	oled->drawRoundRect(x, y, w, h, r, 1);
		oled->display();
    }

    //%
    void drawTriangle(int x0, int y0, int x1, int y1, int x2, int y2){
    	oled->drawTriangle(x0, y0, x1, y1, x2, y2, 1);
		oled->display();
    }

    //%
    void fillTriangle(int x0, int y0, int x1, int y1, int x2, int y2){
    	oled->fillTriangle(x0, y0, x1, y1, x2, y2, 1);
		oled->display();
    }

	//%
	void LoadingScreen() {
		int x,y = 0;
		int w = 21;
		int h = 64;
		for (int i = 0; i < 6;i++){
			fillRect(x, y, w, h);
			x = x + 21;
			oled->display();
		}

	}

	//%
	void showProgress(int progress) {
		oled->clearDisplay();
		drawRect(0,21,128,21);
		fillRect(0,21,progress*128/100,21);
	}
    #define printf(...) uBit.serial.printf(__VA_ARGS__)
#endif
}
