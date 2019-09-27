#include "pxt.h"

namespace makerbit{
    //%
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