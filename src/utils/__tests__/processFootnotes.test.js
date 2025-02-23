import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { processFootnotes } from '../processFootnotes'

describe('processFootnotes', () => {
  it('processes footnotes correctly', () => {
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

    processFootnotes(mockArrayContent, mockArrayFootnotes)

    expect(mockArrayContent[0]).to.eq("<p>As well-regarded members of the Ton[sup]1[/sup], you and your sister have acted as chaperones for social events for the Waldock sisters.</p>")
  })
})