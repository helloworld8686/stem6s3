#include "pxt.h"
//% weight=2 color=#002050 icon="\uf287"
//% advanced=true
namespace serial{
    /**
        * Read the buffered received data as uint8_t
        */
    //% help=serial/read-string
    //% blockId=serial_read_uint8_t
    //% weight=18
    Buffer Read()
    {
        unsigned int data[0];
        int len = 1;

        auto buf = mkBuffer(NULL, 20);
        int read = uBit.serial.read(buf->data, buf->length, MicroBitSerialMode::ASYNC);

        if (read != 20)
        {
            auto prev = buf;
            buf = mkBuffer(buf->data, read);
            decrRC(prev);
        }
        return buf;
    }
}