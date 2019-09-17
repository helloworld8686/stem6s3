let Hour = 0
let Minute = 0
let second = 0
let x = 0
let x_width = 16
let x_Flash1 = 0
let x_Flash2 = 0
OLED.init()
OLED.drawString(0, 32, FrontSize.Size16X16, "~`!@#$%^&*()_+-={}[]\|;:'\"<>,.?/")

basic.forever(function () {
    x = 0
    OLED.drawNumber32X16(x, 0, 2, Hour)
    x = x + 2 * x_width
    x_Flash1 = x
    OLED.drawString(x_Flash1, 0, FrontSize.Size32X32, ":")
    x = x + x_width
    OLED.drawNumber32X16(x, 0, 2, Minute)
    x = x + 2 * x_width + 8
    OLED.drawNumber16X8(x, 12, 2, second)
    basic.pause(10)
//    OLED.drawString(x_Flash1, 0, FrontSize.Size32X32, " ")
//    basic.pause(500)
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
        }    
    }    


})