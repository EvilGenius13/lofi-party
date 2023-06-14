// landing.js
$(document).ready(() => {
    $('#create-room-button').click((e) => {
      e.preventDefault();
      const roomCode = generateRoomCode();
      window.location.href = `/room/${roomCode}`;
    });
  
    $('#join-room-button').click(() => {
      const inputRoomCode = $('#join-room-input').val().trim();
      if (inputRoomCode.length > 0) {
        window.location.href = `/room/${inputRoomCode}`;
      }
    });

    function generateRoomCode() {
        // Generate a random 6-digit room code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
      }
      
  });