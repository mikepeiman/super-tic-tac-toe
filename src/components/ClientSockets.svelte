<script>
  import { onMount } from "svelte";
  import io from "socket.io-client";
  const socket = io();
  // In new components, to do socket.io stuff, you need to declare the below:
  // export let socket;
  // then when you declare the component on this document:
  // <Component {socket}>
  // this is how you keep the same socket connection per component.
export let myUserId
onMount(() => {
  console.log(`ClientSockets mounted`)
  submitUsername("Mike")
})

  // Outgoing functions
  // socket.emit = to server
  function submitUsername(username) {
    if (!username) {
      return;
    }
    socket.emit("add user", username);
    // isLoggedIn = true;
  }

  // Incoming function
  //socket.on = from server
  socket.on("get user id", userId => {
    myUserId = userId;
    console.log(`inside socket.on "get user id" event: `, userId)
  });
</script>
