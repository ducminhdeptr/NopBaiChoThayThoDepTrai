(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function toast(message, type = "success") {
    if (window.Toastify) {
      const bg =
        type === "success"
          ? "#22c55e"
          : type === "error"
            ? "#ef4444"
            : "#f59e0b";
      Toastify({
        text: message,
        duration: 2400,
        gravity: "bottom",
        position: "right",
        backgroundColor: bg,
        stopOnFocus: true,
        style: { borderRadius: "18px", fontWeight: 900 },
      }).showToast();
      return;
    }
    alert(message);
  }

  function confirmDelete(id) {
    if (!window.Swal) return Promise.resolve(false);

    return Swal.fire({
      title: "Xác nhận xóa?",
      text: "Sản phẩm sẽ bị xóa vĩnh viễn khỏi danh sách.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa ngay",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then((res) => res.isConfirmed);
  }

  $$(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (!id) return;

      const ok = await confirmDelete(id);
      if (!ok) return;

      try {
        btn.disabled = true;
        const res = await fetch(`/admin/products/${id}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) throw new Error("Request failed");
        toast("Xóa thành công.", "success");
        setTimeout(() => window.location.reload(), 650);
      } catch (e) {
        toast("Xóa thất bại. Vui lòng thử lại.", "error");
        btn.disabled = false;
      }
    });
  });

  // Image preview
  const imageInput = $("#imageInput");
  const imagePreview = $("#imagePreview");

  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast("File không hợp lệ. Chỉ hỗ trợ ảnh.", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Client-side validation quick check (form)
  const form = $(".admin-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      const name =
        form.querySelector('input[name="name"]')?.value?.trim() || "";
      const price =
        form.querySelector('input[name="price"]')?.value?.trim() || "";
      const desc =
        form.querySelector('textarea[name="description"]')?.value?.trim() || "";
      const categoryId =
        form.querySelector('select[name="category_id"]')?.value || "";

      const errors = [];
      if (!name) errors.push("Tên sản phẩm không được để trống.");
      const priceNum = Number(price);
      if (!price || Number.isNaN(priceNum) || priceNum <= 0)
        errors.push("Giá phải lớn hơn 0.");
      if (!desc) errors.push("Mô tả không được để trống.");
      if (!categoryId) errors.push("Vui lòng chọn danh mục.");

      if (errors.length) {
        e.preventDefault();
        toast(errors[0], "error");
      }
    });
  }
})();
