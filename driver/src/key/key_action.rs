pub enum KeyAction {
  KeyAction(),
  MouseAction(),
}

impl KeyAction {
  pub(crate) fn execute(&self) {
  }
}
