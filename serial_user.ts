//% weight=2 color=#002050 icon="\uf287"
//% advanced=true
namespace serial_user {
    //% shim=serial_user::Read
    export function Read(): Buffer{
        let data:Buffer
        data = pins.createBuffer(1);
        return data
    }
}    