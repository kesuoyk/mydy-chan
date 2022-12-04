import React from 'react';
import { WebMidi } from 'webmidi';
import { NoteNumber } from '../models';

export function useWebMidi(handleNote: (noteNumber: NoteNumber) => void) {
  const [devices, setDevices] = React.useState<any[]>([]);

  React.useEffect(() => {
    WebMidi.enable()
      .then(() => {
        console.log('WebMidi is enabled.')
        const inputs = WebMidi.inputs;

        inputs.forEach((input) => {
          input.addListener('noteon', (e) => {
            console.log(`noteon: ${e.note.getOffsetNumber()}`);
            handleNote(new NoteNumber(e.note.getOffsetNumber()));
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
