import '@testing-library/jest-dom'
import { processFootnotes } from '../processFootnotes'

describe('processFootnotes', () => {


  describe("process footnotes, simple", () => {
      const mockArrayContent = [
        "<p>As well-regarded members of the [var:ton-grimmoireproductions], you and your sister have acted as chaperones for social events for the Waldock sisters.</p>",
        "<p>You suspect [<b>Mr. Martin Cavill</b>] might be corresponding with one of the Middleton brood &ndash; that will need to be nipped in the bud.</p>",
        "<b>Mrs. Huxley</b> meets with <i>the</i> important women of the [var:ton-grimmoireproductions] to discuss important goings on, to occasionally do a bit of light gambling, and, of course, to decide on which marriages are suitable and which marriages are <i>not</i>. It is an exclusive gathering, and there is just such a tea planned for this very Saturday.[sup]1[/sup]</p>",
        "<p>Saturday afternoon is the best time to hunt pheasants, so that’s when you’ve planned it.[sup]2[/sup] You should be finished before Whitney’s tea...</p>",
      ];

      const mockArrayFootnotes = [
        "",
        "<h2>Notes</h2>",
        "<p>[sup]1[/sup] The Bloomsbury Travelling Tea will have two meetings: Friday night at 9 PM and Saturday afternoon at 3 PM. Both in the Warden’s Study.</p>",
        "<p>[sup]2[/sup] The Pheasant Hunt will assemble outside Taylor Hall and progress to the Hunting Grounds on Saturday at 2pm.</p>",
      ];
      beforeAll(() => {
        processFootnotes(mockArrayContent, mockArrayFootnotes);
      });

      it("expects the first instance of a variable to be replaced with a footnote", () => {
        const expectedContent =
          "<p>As well-regarded members of the Ton<sup>1</sup>, you and your sister have acted as chaperones for social events for the Waldock sisters.</p>";
        const expectedFootnote =
          "<p><sup>1</sup> The Ton was the high society in the United Kingdom during the Regency era.</p>";
        expect(mockArrayContent[0]).toEqual(expectedContent);
        expect(mockArrayFootnotes[2]).toEqual(expectedFootnote);
      });
      it("expects the second instance of a variable to be replaced without a footnote", () => {
        const expectedContent =
          "<b>Mrs. Huxley</b> meets with <i>the</i> important women of the Ton to discuss important goings on, to occasionally do a bit of light gambling, and, of course, to decide on which marriages are suitable and which marriages are <i>not</i>. It is an exclusive gathering, and there is just such a tea planned for this very Saturday.<sup>2</sup></p>";

        expect(mockArrayContent[2]).toEqual(expectedContent);
        expect(mockArrayFootnotes[3]).not.toEqual(
          "<p><sup>2</sup> The Ton was the high society in the United Kingdom during the Regency era.</p>",
        );
      });
      it("expects an existing footnote after a variable reference in the same line to be incremented", () => {
        const expectedContent =
          "<b>Mrs. Huxley</b> meets with <i>the</i> important women of the Ton to discuss important goings on, to occasionally do a bit of light gambling, and, of course, to decide on which marriages are suitable and which marriages are <i>not</i>. It is an exclusive gathering, and there is just such a tea planned for this very Saturday.<sup>2</sup></p>";
        const expectedFootnote =
          "<p><sup>2</sup> The Bloomsbury Travelling Tea will have two meetings: Friday night at 9 PM and Saturday afternoon at 3 PM. Both in the Warden’s Study.</p>";
        expect(mockArrayContent[2]).toEqual(expectedContent);
        expect(mockArrayFootnotes[3]).toEqual(expectedFootnote);
      });
      it("expects an existing footnote in a line after a variable reference to be incremented", () => {
        const expectedContent =
          "<p>Saturday afternoon is the best time to hunt pheasants, so that’s when you’ve planned it.<sup>3</sup> You should be finished before Whitney’s tea...</p>";
        const expectedFootnote =
          "<p><sup>3</sup> The Pheasant Hunt will assemble outside Taylor Hall and progress to the Hunting Grounds on Saturday at 2pm.</p>";
        expect(mockArrayContent[3]).toEqual(expectedContent);
        expect(mockArrayFootnotes[4]).toEqual(expectedFootnote);
      });
  })
  
  it('expects the variable reference to be properly inserted and incremented when first footnote', () => {
    const mockArrayContent = [
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. [sup]1[/sup] Maecenas volutpat.</p>",
      "<p>In finibus aliquet tempus [var:ton-grimmoireproductions] Donec auctor erat non purus hendrerit, eu dictum odio finibus.[sup]2[/sup]</p>",
      "<p>Nunc libero nibh, dapibus nec ultrices non, laoreet ultrices nunc.[sup]3[/sup] Integer lacus tortor, dictum eu mi id, consectetur venenatis enim.</p>",
      "In hac habitasse platea dictumst.[sup]4[/sup] Phasellus luctus tincidunt.</p>",
      "<p>Aenean volutpat turpis[sup]5[/sup] at pharetra pharetra</p>",
    ];
    const mockArrayFootnotes = [
      "",
      "<h2>Notes</h2>",
      "<p>[sup]1[/sup] Vestibulum sit amet purus egestas.</p>",
      "<p>[sup]2[/sup] Quisque vulputate est eget metus ornare.</p>",
      "<p>[sup]3[/sup] Mauris at augue venenatis.</p>",
      "<p>[sup]4[/sup] Sed elementum est vitae sollicitudin aliquet.</p>",
      "<p>[sup]5[/sup] Praesent iaculis porttitor eros.</p>",
    ];

    const expectedArrayContent = [
      "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. <sup>1</sup> Maecenas volutpat.</p>",
      "<p>In finibus aliquet tempus Ton<sup>2</sup> Donec auctor erat non purus hendrerit, eu dictum odio finibus.<sup>3</sup></p>",
      "<p>Nunc libero nibh, dapibus nec ultrices non, laoreet ultrices nunc.<sup>4</sup> Integer lacus tortor, dictum eu mi id, consectetur venenatis enim.</p>",
      "In hac habitasse platea dictumst.<sup>5</sup> Phasellus luctus tincidunt.</p>",
      "<p>Aenean volutpat turpis<sup>6</sup> at pharetra pharetra</p>",
    ];

    const expectedArrayFootnotes = [
      "",
      "<h2>Notes</h2>",
      "<p><sup>1</sup> Vestibulum sit amet purus egestas.</p>",
      "<p><sup>2</sup> The Ton was the high society in the United Kingdom during the Regency era.</p>",
      "<p><sup>3</sup> Quisque vulputate est eget metus ornare.</p>",
      "<p><sup>4</sup> Mauris at augue venenatis.</p>",
      "<p><sup>5</sup> Sed elementum est vitae sollicitudin aliquet.</p>",
      "<p><sup>6</sup> Praesent iaculis porttitor eros.</p>",
    ];

    processFootnotes(mockArrayContent, mockArrayFootnotes);

    // first footnote
    expect(mockArrayContent[0]).toEqual(expectedArrayContent[0]);
    expect(mockArrayFootnotes[2]).toEqual(expectedArrayFootnotes[2]);

    // var insert
    expect(mockArrayContent[1]).toEqual(expectedArrayContent[1]);
    expect(mockArrayFootnotes[3]).toEqual(expectedArrayFootnotes[3]);
    expect(mockArrayFootnotes[4]).toEqual(expectedArrayFootnotes[4]);

    // after var insert
    expect(mockArrayContent[2]).toEqual(expectedArrayContent[2]);
    expect(mockArrayFootnotes[5]).toEqual(expectedArrayFootnotes[5]);
  })

    it("expects the variable reference to be properly inserted and incremented", () => {
      const mockArrayContent = [
        "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit [var:ton-grimmoireproductions].</p>",
        "<p>In finibus aliquet tempus [sup]1[/sup]. Donec auctor erat non purus hendrerit, eu dictum odio finibus.[sup]2[/sup] Nunc libero nibh, dapibus nec ultrices non, laoreet ultrices nunc.</p>",
      ];
      const mockArrayFootnotes = [
        "",
        "<h2>Notes</h2>",
        "<p>[sup]1[/sup] Vestibulum sit amet purus egestas.</p>",
        "<p>[sup]2[/sup] Quisque vulputate est eget metus ornare.</p>",
      ];

      const expectedArrayContent = [
        "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit Ton<sup>1</sup>.</p>",
        "<p>In finibus aliquet tempus <sup>2</sup>. Donec auctor erat non purus hendrerit, eu dictum odio finibus.<sup>3</sup> Nunc libero nibh, dapibus nec ultrices non, laoreet ultrices nunc.</p>",
      ];

      const expectedArrayFootnotes = [
        "",
        "<h2>Notes</h2>",
        "<p><sup>1</sup> The Ton was the high society in the United Kingdom during the Regency era.</p>",
        "<p><sup>2</sup> Vestibulum sit amet purus egestas.</p>",
        "<p><sup>3</sup> Quisque vulputate est eget metus ornare.</p>"
      ];

      processFootnotes(mockArrayContent, mockArrayFootnotes);


      expect(mockArrayContent[0]).toEqual(expectedArrayContent[0]);
      expect(mockArrayContent[1]).toEqual(expectedArrayContent[1]);

      expect(mockArrayFootnotes[2]).toEqual(expectedArrayFootnotes[2]);
      expect(mockArrayFootnotes[3]).toEqual(expectedArrayFootnotes[3]);
      expect(mockArrayFootnotes[4]).toEqual(expectedArrayFootnotes[4]);
    });

    it("handles case where variable and footnote are in the same string", () => {
      const mockArrayContent = [
        "<p>The [var:ton-grimmoireproductions] is full of parties and opportunities to laugh with all the right people; however, there are moments when the season can be a bit stuffy. You know just the thing to liven it up. A game of cricket![sup]1[/sup]</p>",
      ];

      const mockArrayFootnotes = [
        "",
        "<h2>Notes</h2>",
        "<p>[sup]1[/sup] The Cricket Match will be Saturday at 3 PM on the Lawn.</p>",
      ];

      const expectedArrayContent = [
        "<p>The Ton<sup>1</sup> is full of parties and opportunities to laugh with all the right people; however, there are moments when the season can be a bit stuffy. You know just the thing to liven it up. A game of cricket!<sup>2</sup></p>",
      ];

      const expectedArrayFootnotes = [
        "",
        "<h2>Notes</h2>",
        "<p><sup>1</sup> The Ton was the high society in the United Kingdom during the Regency era.</p>",
        "<p><sup>2</sup> The Cricket Match will be Saturday at 3 PM on the Lawn.</p>",
      ];

      processFootnotes(mockArrayContent, mockArrayFootnotes);

      expect(mockArrayContent[0]).toEqual(expectedArrayContent[0]);
      expect(mockArrayContent[1]).toEqual(expectedArrayContent[1]);

      expect(mockArrayFootnotes[3]).toEqual(expectedArrayFootnotes[3]);
      expect(mockArrayFootnotes[2]).toEqual(expectedArrayFootnotes[2]);

    })
})