document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll(".shopping-list-checkbox");

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", async function () {
      const itemElement = this.closest(".shopping-list-item");
      const itemId = itemElement.getAttribute("data-id");

      try {
        const response = await fetch(`/users/${userId}/shopping-list/${itemId}/toggle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          // If the item is purchased, remove it from the DOM
          if (data.item.purchased) {
            itemElement.remove();
          }
        } else {
          console.error("Failed to toggle shopping list item:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});
