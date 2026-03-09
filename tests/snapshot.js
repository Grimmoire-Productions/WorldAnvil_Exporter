import { render } from "@testing-library/react";
import Root from "../app/root";

it("renders main page unchanged", () => {
  const { container } = render(<Root />);
  expect(container).toMatchSnapshot();
});
