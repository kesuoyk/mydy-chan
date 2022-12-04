/**
 * MIDIのノートナンバー
 */
export class NoteNumber {
  constructor(
    public readonly value: number
  ) {
    if (!(0 <= value && value <= 127)) {
      throw new Error();
    }
  }
}
