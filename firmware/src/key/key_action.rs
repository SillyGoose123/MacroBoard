use ts_bind::TsBind;

#[derive(TsBind)]
pub enum KeyAction {
  KeyAction(),
  MouseAction(),
}

impl KeyAction {
    pub fn execute(&self) {}
}