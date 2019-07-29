﻿using System;
using AlphaTab.Audio.Synth.Sf2.Chunks;
using AlphaTab.IO;

namespace AlphaTab.Audio.Synth.Sf2
{
    internal class SoundFontPresets
    {
        public SampleHeader[] SampleHeaders { get; private set; }
        public PresetHeader[] PresetHeaders { get; private set; }
        public Instrument[] Instruments { get; private set; }

        public SoundFontPresets(IReadable input)
        {
            var id = input.Read8BitChars(4);
            var size = input.ReadInt32LE();
            if (id.ToLower() != "list")
            {
                throw new Exception("Invalid soundfont. Could not find pdta LIST chunk.");
            }

            var readTo = input.Position + size;
            id = input.Read8BitChars(4);
            if (id.ToLower() != "pdta")
            {
                throw new Exception("Invalid soundfont. The LIST chunk is not of type pdta.");
            }

            Modulator[] presetModulators = null;
            Generator[] presetGenerators = null;
            Modulator[] instrumentModulators = null;
            Generator[] instrumentGenerators = null;

            ZoneChunk pbag = null;
            ZoneChunk ibag = null;
            PresetHeaderChunk phdr = null;
            InstrumentChunk inst = null;

            while (input.Position < readTo)
            {
                id = input.Read8BitChars(4);
                size = input.ReadInt32LE();
                switch (id.ToLower())
                {
                    case "phdr":
                        phdr = new PresetHeaderChunk(id, size, input);
                        break;
                    case "pbag":
                        pbag = new ZoneChunk(id, size, input);
                        break;
                    case "pmod":
                        presetModulators = new ModulatorChunk(id, size, input).Modulators;
                        break;
                    case "pgen":
                        presetGenerators = new GeneratorChunk(id, size, input).Generators;
                        break;
                    case "inst":
                        inst = new InstrumentChunk(id, size, input);
                        break;
                    case "ibag":
                        ibag = new ZoneChunk(id, size, input);
                        break;
                    case "imod":
                        instrumentModulators = new ModulatorChunk(id, size, input).Modulators;
                        break;
                    case "igen":
                        instrumentGenerators = new GeneratorChunk(id, size, input).Generators;
                        break;
                    case "shdr":
                        SampleHeaders = new SampleHeaderChunk(id, size, input).SampleHeaders;
                        break;
                    default:
                        throw new Exception("Invalid soundfont. Unrecognized sub chunk: " + id);
                }
            }

            var pZones = pbag.ToZones(presetModulators, presetGenerators);
            PresetHeaders = phdr.ToPresets(pZones);
            var iZones = ibag.ToZones(instrumentModulators, instrumentGenerators);
            Instruments = inst.ToInstruments(iZones);
        }
    }
}
