enum Modifier {
  LShift = 1,
  RShift = 5,
  LAlt = 2,
  RAlt = 6,
  LCtrl = 0,
  RCtrl = 4,
  LGui = 3,
  RGui = 7,

}


struct KeyStroke {
  keycodes: [u8; 6],
  modifier: Modifier,
}