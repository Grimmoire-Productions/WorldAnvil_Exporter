import '@testing-library/jest-dom'
import { processFootnotes } from '../processFootnotes'

describe('processFootnotes', () => {
      const mockArrayContent = [
        "<p>As well-regarded members of the [var:ton-grimmoireproductions], you and your sister have acted as chaperones for social events for the Waldock sisters.</p>",
        "<p>You suspect [<b>Mr. Martin Cavill</b>] might be corresponding with one of the Middleton brood &ndash; that will need to be nipped in the bud.</p>",
        "<b>Mrs. Huxley</b> meets with <i>the</i> important women of the [var:ton-grimmoireproductions] to discuss important goings on, to occasionally do a bit of light gambling, and, of course, to decide on which marriages are suitable and which marriages are <i>not</i>. It is an exclusive gathering, and there is just such a tea planned for this very Saturday.[sup]1[/sup]</p>",
        "<p>Saturday afternoon is the best time to hunt pheasants, so that’s when you’ve planned it.[sup]2[/sup] You should be finished before Whitney’s tea...</p>"
    ]

    const mockArrayFootnotes = [
        "",
        "<h2>Notes</h2>",
        "<p>[sup]1[/sup] The Bloomsbury Travelling Tea will have two meetings: Friday night at 9 PM and Saturday afternoon at 3 PM. Both in the Warden’s Study.</p>",
        "<p>[sup]2[/sup] The Pheasant Hunt will assemble outside Taylor Hall and progress to the Hunting Grounds on Saturday at 2pm.</p>"
    ]
  beforeAll(() => {
    processFootnotes(mockArrayContent, mockArrayFootnotes)
  })

  it('expects the first instance of a variable to be replaced with a footnote', () => {
    const expectedContent = "<p>As well-regarded members of the Ton<sup>1</sup>, you and your sister have acted as chaperones for social events for the Waldock sisters.</p>"
    const expectedFootnote = "<p><sup>1</sup> The Ton was the high society in the United Kingdom during the Regency era.</p>"
    expect(mockArrayContent[0]).toEqual(expectedContent)
    expect(mockArrayFootnotes[2]).toEqual(expectedFootnote)
  })
  it('expects the second instance of a variable to be replaced without a footnote', () => {
    const expectedContent = "<b>Mrs. Huxley</b> meets with <i>the</i> important women of the Ton to discuss important goings on, to occasionally do a bit of light gambling, and, of course, to decide on which marriages are suitable and which marriages are <i>not</i>. It is an exclusive gathering, and there is just such a tea planned for this very Saturday.<sup>2</sup></p>"

    expect(mockArrayContent[2]).toEqual(expectedContent)
    expect(mockArrayFootnotes[3]).not.toEqual("<p><sup>2</sup> The Ton was the high society in the United Kingdom during the Regency era.</p>",)
  })
  it('expects an existing footnote after a variable reference in the same line to be incremented', () => {
    const expectedContent = "<b>Mrs. Huxley</b> meets with <i>the</i> important women of the Ton to discuss important goings on, to occasionally do a bit of light gambling, and, of course, to decide on which marriages are suitable and which marriages are <i>not</i>. It is an exclusive gathering, and there is just such a tea planned for this very Saturday.<sup>2</sup></p>"
    const expectedFootnote = "<p><sup>2</sup> The Bloomsbury Travelling Tea will have two meetings: Friday night at 9 PM and Saturday afternoon at 3 PM. Both in the Warden’s Study.</p>"
    expect(mockArrayContent[2]).toEqual(expectedContent)
    expect(mockArrayFootnotes[3]).toEqual(expectedFootnote)
  })
    it('expects an existing footnote in a line after a variable reference to be incremented', () => {
    const expectedContent = "<p>Saturday afternoon is the best time to hunt pheasants, so that’s when you’ve planned it.<sup>3</sup> You should be finished before Whitney’s tea...</p>"
    const expectedFootnote = "<p><sup>3</sup> The Pheasant Hunt will assemble outside Taylor Hall and progress to the Hunting Grounds on Saturday at 2pm.</p>"
    expect(mockArrayContent[3]).toEqual(expectedContent)
    expect(mockArrayFootnotes[4]).toEqual(expectedFootnote)
  })
})