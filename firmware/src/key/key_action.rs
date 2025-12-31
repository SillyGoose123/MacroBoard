pub enum KeyAction {
  KeyAction(),
  MouseAction(),
}

impl KeyAction {
    pub fn execute(&self) {}
}