import Chat from '../src/chat';

// Mock the tmi.Client class
jest.mock('tmi.js', () => {
    class MockClient {
      constructor(options) {
        this.options = options;
        this._events = {};
      }

      connect() {
        return Promise.resolve();
      }

      on(event, handler) {
        if (!this._events[event]) {
          this._events[event] = [];
        }
        this._events[event].push(handler);
      }

      say = jest.fn();

      action = jest.fn();
    }

    return {
      Client: MockClient,
    };
  });

describe('Chat', () => {
  let mockScene;
  let chat;

  beforeEach(() => {
    mockScene = {
      loadGame: jest.fn(),
      addPlayer: jest.fn(),
      attack: jest.fn(),
      move: jest.fn(),
      shield: jest.fn(),
    };

    chat = new Chat(mockScene, 'username', 'password', ['channels']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the chat client', () => {
    //dconst clientConstructor = jest.spyOn(chat.client, 'constructor').mockImplementation();

    const clientOptions = chat.client.options;
    expect(clientOptions).toEqual({
      options: { debug: true },
      identity: {
        username: 'devdiaries',
        password: 'oauth:bhtp65u3qmwj803txw3gv650cz91v1',
      },
      channels: ['devdiaries'],
    });

    // expect(chat.client.connect).toHaveBeenCalled();
  });

  it('should call say method on the client', () => {
    chat.say('Hello');
    expect(chat.client.say).toHaveBeenCalledWith('devdiaries', 'Hello');
  });

  it('should load the game when connected', async () => {
    await chat.client._events.join[0]('channel', 'username', true);

    expect(mockScene.loadGame).toHaveBeenCalled();
  });

  it('should add a player when someone joins the chat', async () => {
    await chat.client._events.join[0]('channel', 'username', true);

    expect(mockScene.addPlayer).toHaveBeenCalledWith('username');
  });

  it('should send a response when receiving "!hello" message', async () => {
    const sayMock = jest.spyOn(chat.client, 'say').mockImplementation();

    await chat.client._events.message[0](
      'channel',
      { username: 'sender' },
      '!hello',
      false
    );

    expect(chat.client.say).toHaveBeenCalledWith(
      'channel',
      '@sender, heya!'
    );
  });

  it('should add a player and send a response when receiving "!join" message', async () => {
    // const actionMock = jest.spyOn(chat.client, 'action').mockImplementation();

    await chat.client._events.chat[0](
      'channel',
      { 'display-name': 'user', mod: false },
      '!join',
      false
    );

    expect(chat.client.action).toHaveBeenCalledWith(
      'channel',
      'user joins the battle!!!'
    );

    expect(mockScene.addPlayer).toHaveBeenCalledWith('user');
  });

  it('should attack and send a response when receiving "!fb" message', async () => {
    // const actionMock = jest.spyOn(chat.client, 'action').mockImplementation();

    await chat.client._events.chat[0](
      'channel',
      { 'display-name': 'user', mod: false },
      '!fb 10 20',
      false
    );

    expect(chat.client.action).toHaveBeenCalledWith(
      'channel',
      'user attacks 10 20'
    );

    expect(mockScene.attack).toHaveBeenCalledWith('user', '10', '20');
  });

  it('should move and send a response when receiving "!mv" message', async () => {
    await chat.client._events.chat[0](
      'channel',
      { 'display-name': 'user', mod: false },
      '!mv 10 20',
      false
    );

    expect(chat.client.action).toHaveBeenCalledWith(
      'channel',
      'user moves to 10 20'
    );

    expect(mockScene.move).toHaveBeenCalledWith('user', '10', '20');
  });

  it('should create shield and send a response when receiving "!sh" message', async () => {
    await chat.client._events.chat[0](
      'channel',
      { 'display-name': 'user', mod: false },
      '!sh 10',
      false
    );

    expect(chat.client.action).toHaveBeenCalledWith(
      'channel',
      'user launches shield of 10'
    );

    expect(mockScene.shield).toHaveBeenCalledWith('user', '10');
  });

  it.skip('should generate info for username', async () => {
    await chat.client._events.chat[0](
      'channel',
      { 'display-name': 'user', mod: false },
      '!in user2',
      false
    );

    expect(chat.client.action).toHaveBeenCalledWith(
      'channel',
      'user requests info for user2'
    );

    expect(mockScene.shield).toHaveBeenCalledWith('user2');
  });
});
