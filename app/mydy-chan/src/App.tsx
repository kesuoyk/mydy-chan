import React from 'react';
import { OpenSheetMusicDisplay, Cursor } from 'opensheetmusicdisplay';
import { WebMidi } from 'webmidi';
import './App.css';

function App() {
  const devices = useWebMidi(onNoteOn);
  const containerRef = React.useRef(null);
  const osmdRef = React.useRef<OpenSheetMusicDisplay>();

  React.useEffect(() => {
    if (! osmdRef.current) {
      osmdRef.current = new OpenSheetMusicDisplay('container');
    }
    const o = osmdRef.current;
    o.load('/test.mxl').then(() => {
      o.render();
      o.cursor.show();
      logCursor(o.cursor);
    }).catch((e) => {
      throw e;
    });
  }, []);

  function onNoteOn(noteNumber: number) {
    function isCorrect() {
      if (!osmdRef.current) {
        throw new Error();
      }

      const inputNoteNumber = noteNumber;
      const cursorNoteNumbers = getCursorNoteNumbers(osmdRef.current.cursor);

      // すべて休符の場合
      if (cursorNoteNumbers.length < 1) {
        return true;
      }

      return inputNoteNumber === cursorNoteNumbers[0];
    }

    if (! isCorrect()) {
      console.log('incorrect');
      return;
    }

    showNextCursor();
  }

  function showNextCursor() {
    if (! osmdRef.current) {
      return;
    }

    const cursor = osmdRef.current.cursor;
    cursor.next();
    logCursor(cursor);
  }

  function logCursor(cursor: Cursor) {
    console.log('cursor: ', getCursorNoteNumbers(cursor));
  }

  function getCursorNoteNumbers(cursor: Cursor) {
    const notes = cursor.NotesUnderCursor()
        // 休符は除く
        .filter((note) => !note.isRest())
        // ノートナンバーだけ取り出す
        .map((note) => note.halfTone)
        // ノートナンバーの低い順にソート
        .sort((a, b) => a - b)
        // OSMDはMiddleCの値がMIDI標準より1オクターブ低いので+12する
        // https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/issues/715
        .map((noteNumber) => noteNumber + 12);

    return notes;
  }

  return (
    <div className="App">
      <button onClick={showNextCursor}>Next</button>
      <ul>
        {devices.length > 0
          ? devices.map(device => (
            <li>{JSON.stringify(device)}</li>
          ))
          : (
            <li>No devices</li>
          )}
      </ul>
      <div id="container" ref={containerRef} ></div>
    </div>
  );
}

function useWebMidi(onNoteOn: (noteNumber: number) => void) {
  const [devices, setDevices] = React.useState<any[]>([]);

  React.useEffect(() => {
    WebMidi.enable()
      .then(() => {
        console.log('WebMidi is enabled.')
        const inputs = WebMidi.inputs;

        inputs.forEach((input) => {
          input.addListener('noteon', (e) => {
            console.log(`noteon: ${e.note.getOffsetNumber()}`);
            onNoteOn(e.note.getOffsetNumber());
          });
        });

        setDevices(inputs.map(input => ({
          id: input.id,
          name: input.name,
        })));
      })
      .catch((e) => {
        throw e;
      });
  }, []);

  return devices;
};

export default App;
