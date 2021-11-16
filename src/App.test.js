import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "./App";
import { handlers } from "./mocks/handlers";
import { server } from "./mocks/server";

const sleep = t => new Promise(resolve => setTimeout(resolve, t));
describe("App component", () => {
  it("there are a welcome message and header when rendering app", () => {
    const { getByText, getByRole } = render(<App />);
    const welcomeMsg = getByText(/welcome to hackyourweather/i);
    expect(welcomeMsg).toBeInTheDocument();

    const header = getByRole("heading", { name: "Weather" });
    expect(header).toBeInTheDocument();
  });

  describe("testing API requests", () => {
    beforeAll(() => {
      // Establish requests interception layer before all tests.
      server.listen();
    });
    afterEach(() => {
      server.resetHandlers();
    });
    afterAll(() => {
      // Clean up after all tests are done, preventing this
      // interception layer from affecting irrelevant tests.
      server.close();
    });

    describe("doing right requests", () => {


      it("loading text while fetching data", async () => {
        server.use(handlers[0])
        const { getByRole, getByText } = render(<App />);
        const searchButton = getByRole("button", { name: /search/i });
        fireEvent.submit(searchButton);

        const loading = getByText(/loading/i);
        expect(loading).toBeInTheDocument();
      });

      it("No Loading text when getting info", async () => {
        server.use(handlers[0])
        const { getByRole, findByText, findByTestId, getByText, getByTestId } = render(<App />);
        const searchButton = getByRole("button", { name: /search/i });
        fireEvent.submit(searchButton);
        const loading = getByText(/loading/i);
        expect(loading).toBeInTheDocument();

        const weatherInfo = await findByTestId("min");
        expect(weatherInfo).toBeInTheDocument();
        expect(loading).not.toBeInTheDocument();
      });

      it("Delete the city when I click the deletion button", async () => {
        server.use(handlers[0])
        const { getByRole, findByTestId } = render(<App />);
        const searchButton = getByRole("button", { name: /search/i });
        fireEvent.submit(searchButton);

        const weatherCard = await findByTestId("weather_card_0");
        expect(weatherCard).toBeInTheDocument();
        const deleteButton = await findByTestId("delete_button_0");
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);
        expect(weatherCard).not.toBeInTheDocument();
      });

      it("if I have more than one city del button should delete the right city", async () => {
        server.use(handlers[0])
        const { getByRole, findByTestId } = render(<App />);
        const searchButton = getByRole("button", { name: /search/i });
        fireEvent.submit(searchButton);

        const weatherCard_0 = await findByTestId("weather_card_0");
        expect(weatherCard_0).toBeInTheDocument();
        const deleteButton_0 = await findByTestId("delete_button_0");
        expect(deleteButton_0).toBeInTheDocument();

        fireEvent.submit(searchButton);
        const weatherCard_1 = await findByTestId("weather_card_1");
        const delete_button_1 = await findByTestId("delete_button_1");
        expect(weatherCard_1).toBeInTheDocument();
        expect(delete_button_1).toBeInTheDocument();

        fireEvent.submit(searchButton);
        const weatherCard_2 = await findByTestId("weather_card_2");
        const delete_button_2 = await findByTestId("delete_button_2");
        expect(weatherCard_2).toBeInTheDocument();
        expect(delete_button_2).toBeInTheDocument();

        fireEvent.click(delete_button_2);
        expect(weatherCard_0).toBeInTheDocument();
        expect(weatherCard_1).toBeInTheDocument();
        expect(weatherCard_2).not.toBeInTheDocument();
      });
    });

    describe("do with error", () => {
      it("it's loading before getting error", async () => {
        server.use(handlers[1]);
        const { getByRole, findByText } = render(<App />);
        const searchButton = getByRole("button", { name: /search/i });
        expect(searchButton).toBeInTheDocument();

        fireEvent.submit(searchButton);
        const loading = await findByText(/loading/i);
        expect(loading).toBeInTheDocument();
      });

      it("Get error When writing invalid city name", async () => {
        server.use(handlers[1]);
        const { getByRole, findByText } = render(<App />);
        const searchButton = getByRole("button", { name: /search/i });
        expect(searchButton).toBeInTheDocument();

        fireEvent.submit(searchButton);
        const err = await findByText("city not found");
        expect(err).toBeInTheDocument();
      });

      it("loading is disappeared after getting error", async () => {
        server.use(handlers[1]);
        const { getByRole, findByText } = render(<App />);
        const searchButton = getByRole("button", { name: /search/i });
        expect(searchButton).toBeInTheDocument();
        fireEvent.submit(searchButton);

        const loading = await findByText(/loading/i);
        expect(loading).toBeInTheDocument();

        const err = await findByText("city not found");
        expect(err).toBeInTheDocument();

        expect(loading).not.toBeInTheDocument();
      });
    });
  });
});
