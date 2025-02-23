document.addEventListener("DOMContentLoaded", function () {
    console.log("TEST");
    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.alignItems = "center";
    form.style.justifyContent = "center";
    form.style.height = "100vh";

    const label = document.createElement("label");
    label.textContent = "Enter your nickname:";
    label.style.fontSize = "20px";
    label.style.marginBottom = "10px";
    
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Nickname";
    input.style.padding = "10px";
    input.style.fontSize = "18px";
    input.style.borderRadius = "5px";
    input.style.border = "1px solid #000";

    const button = document.createElement("button");
    button.textContent = "Start Game";
    button.style.marginTop = "10px";
    button.style.padding = "10px 20px";
    button.style.fontSize = "18px";
    button.style.cursor = "pointer";
    
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);
    document.body.appendChild(form);

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const nickname = input.value.trim();
        if (nickname) {
            try {
                const response = await fetch("/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nickname })
                });
                if (response.ok) {
                    window.location.href = "game.html";
                } else {
                    alert("Failed to create player. Try again.");
                }
            } catch (error) {
                alert("Error connecting to server. Try again.");
            }
        } else {
            alert("Please enter a nickname to start the game.");
        }
    });
});
