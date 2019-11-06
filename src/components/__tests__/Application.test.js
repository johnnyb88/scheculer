import React from "react";

import { getByAltText, getByPlaceholderText, getByText, queryByText, getAllByTestId, prettyDOM,render, cleanup, waitForElement, fireEvent } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios"

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", () => {
    const { getByText } = render(
      <Application />
    );
    return waitForElement(() => {
        return getByText("Monday")
      })
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    
    
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // ----- render the Application ----- //
    const { container, debug } = render(<Application />);

    // ----- wait until the application gets data back from the mock server, and check if "Archie Cohen" is in the DOM ----- //
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    // ----- click the edit button on archie's appointment ----- //
    fireEvent.click(getByAltText(appointment, "Edit"))
    expect(getByPlaceholderText(appointment, /enter student name/i)).toBeInTheDocument();

    // ----- find input field, change name to "Bob" ----- //
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Bob" } });
    // ----- click on some interviewer ----- //
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    // ----- click save ----- //
    fireEvent.click(getByText(appointment, "Save"));
    // ----- check that saving is in the DOM -----//
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // ----- wait until "Bob" appears in the DOM again ----- //
    await waitForElement(() => getByText(appointment, "Bob"));
    expect(getByText(appointment, "Bob")).toBeInTheDocument();
    // ----- check to see that the spots for monday is unchanged ----- //
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // ----- render Application ----- //
    const { container } = render(<Application />);

    // ------ wait for and find an existing appointment (archie cohen) ----- //
    await waitForElement(() => getByText(container, /archie cohen/i));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    // ----- click edit ----- //
    fireEvent.click(getByAltText(appointment, "Edit"));
    expect(getByPlaceholderText(appointment, /enter student name/i)).toBeInTheDocument();
    // ----- click save ----- //
    fireEvent.click(getByText(appointment, "Save"));
    // ----- expect saving to show up ----- //
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    // ----- expect to find "Error on save! Please try again" ----- //
    await waitForElement(() => queryByText(appointment, /error on save! please try again/i));
    expect(queryByText(appointment, /error on save! please try again/i)).toBeInTheDocument();
    // ----- click the close button ----- //
    fireEvent.click(getByAltText(appointment, "Close"));
    // ----- expect to see archie cohen again ----- //
    expect(getByPlaceholderText(appointment, /enter student name/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // ----- render Application ----- //
    const { container } = render(<Application />);

    // ----- wait for and find an existing appointment (archie cohen) ----- //
    await waitForElement(() => getByText(container, /archie cohen/i));

    // ----- scoping stuff ----- //
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    // ----- click delete ----- //
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, /are you sure?/i)).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));

    // ----- expect deleting to show up ----- //
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    // ----- wait for and expect to find "Error on delete! Please try again" ----- //
    await waitForElement(() => queryByText(appointment, /error on delete! please try again/i));
    expect(queryByText(appointment, /error on delete! please try again/i)).toBeInTheDocument();
    
    // ----- click the close button ----- //
    fireEvent.click(getByAltText(appointment, "Close"));

    // ----- expect to see archie cohen again ----- //
    expect(getByText(appointment, /archie cohen/i)).toBeInTheDocument();

  });
});
