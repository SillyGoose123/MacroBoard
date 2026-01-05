use smart_leds::RGB8;
use ts_bind::TsBind;

#[derive(TsBind)]
pub struct Flash {
    pub rgb: RGB8,
    pub duration: u8,
}
