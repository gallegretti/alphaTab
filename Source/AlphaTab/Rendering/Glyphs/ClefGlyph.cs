﻿using AlphaTab.Model;
using AlphaTab.Platform;

namespace AlphaTab.Rendering.Glyphs
{
    internal class ClefGlyph : MusicFontGlyph
    {
        private readonly Clef _clef;
        private readonly Ottavia _clefOttava;

        public ClefGlyph(float x, float y, Clef clef, Ottavia clefOttava)
            : base(x, y, 1, GetSymbol(clef))
        {
            _clef = clef;
            _clefOttava = clefOttava;
        }

        public override void DoLayout()
        {
            switch (_clef)
            {
                case Clef.Neutral:
                    Width = 15 * Scale;
                    break;
                case Clef.C3:
                case Clef.C4:
                case Clef.F4:
                case Clef.G2:
                    Width = 28 * Scale;
                    break;
            }
        }

        private static MusicFontSymbol GetSymbol(Clef clef)
        {
            switch (clef)
            {
                case Clef.Neutral:
                    return MusicFontSymbol.ClefNeutral;
                case Clef.C3:
                    return MusicFontSymbol.ClefC;
                case Clef.C4:
                    return MusicFontSymbol.ClefC;
                case Clef.F4:
                    return MusicFontSymbol.ClefF;
                case Clef.G2:
                    return MusicFontSymbol.ClefG;
                default:
                    return MusicFontSymbol.None;
            }
        }

        public override void Paint(float cx, float cy, ICanvas canvas)
        {
            base.Paint(cx, cy, canvas);
            Glyph numberGlyph;
            var top = false;
            switch (_clefOttava)
            {
                case Ottavia._15ma:
                    numberGlyph = new MusicFontGlyph(-4 * Scale, 0, 0.5f, MusicFontSymbol.Ottava15);
                    top = true;
                    break;
                case Ottavia._8va:
                    numberGlyph = new MusicFontGlyph(-2 * Scale, 0, 0.5f, MusicFontSymbol.Ottava8);
                    top = true;
                    break;
                case Ottavia._8vb:
                    numberGlyph = new MusicFontGlyph(-6 * Scale, 0, 0.5f, MusicFontSymbol.Ottava8);
                    break;
                case Ottavia._15mb:
                    numberGlyph = new MusicFontGlyph(-8 * Scale, 0, 0.5f, MusicFontSymbol.Ottava15);
                    break;
                default:
                    return;
            }

            int offsetY;
            int offsetX;

            switch (_clef)
            {
                case Clef.Neutral:
                    offsetY = top ? -12 : 15;
                    offsetX = 0;
                    break;
                case Clef.C3:
                    offsetY = top ? -19 : 27;
                    offsetX = 0;
                    break;
                case Clef.C4:
                    offsetY = top ? -19 : 27;
                    offsetX = 0;
                    break;
                case Clef.F4:
                    offsetY = top ? -9 : 27;
                    offsetX = -4;
                    break;
                case Clef.G2:
                    offsetY = top ? -37 : 30;
                    offsetX = 0;
                    break;
                default:
                    return;
            }

            numberGlyph.Renderer = Renderer;
            numberGlyph.DoLayout();

            var x = Width / 2;

            numberGlyph.Paint(cx + X + x + offsetX * Scale, cy + Y + offsetY * Scale, canvas);
        }
    }
}
