namespace serial_user {

    /**
     * Read the buffered received data as uint8_t
     */
    //% shim=serial_user::Read
    export function Read():Buffer{
        let data: Buffer 
        data = pins.createBuffer(1)
        return data
    } 
}