document.addEventListener("D0MContentLoaded",function () {
    const io = new Intersectionobserver(
        (entries)=>{
            entries.forEach((e)=>{
                if (e.isintersecting) {
                    e.target.classList.add("in");
                    io.unobserve(e.target);
                }
            });
        },
        {threshold: 0.12 }
    );
    document.querySelectorALL(".reveal").forEach((el)=> io.observe(el));
});

document.addEventListener("DOMContentLoaded", function () {
    // Tìm form đặt hàng dựa vào class .order-form
    const orderForm = document.querySelector(".order-form");

    if (orderForm) {
        orderForm.addEventListener("submit", function (event) {
            // 1. Ngăn chặn hành vi tải lại trang mặc định của form
            event.preventDefault();

            // 2. Lấy dữ liệu từ các ô nhập liệu (Input) trong form
            const fullname = document.getElementById("fullname") ? document.getElementById("fullname").value : "";
            const phone = document.getElementById("phone") ? document.getElementById("phone").value : "";
            const product = document.getElementById("product") ? document.getElementById("product").value : "";
            const quantity = document.getElementById("quantity") ? document.getElementById("quantity").value : "1";
            const note = document.getElementById("note") ? document.getElementById("note").value : "";

            // 3. Khởi tạo nội dung file CSV (Định dạng Excel có thể đọc)
            // Hàng đầu tiên là Tiêu đề các cột (Header)
            let csvContent = "Họ và Tên,Số Điện Thoại,Sản Phẩm Đặt,Số Lượng,Ghi Chú/Địa Chỉ\n";
            
            // Hàng thứ hai điền dữ liệu của khách hàng nhập vào (Dùng dấu phẩy để tách cột)
            // Thay thế dấu phẩy trong nội dung ghi chú bằng dấu chấm để tránh lệch cột trong Excel
            const safeNote = note.replace(/,/g, "."); 
            csvContent += `"${fullname}","${phone}","${product}","${quantity}","${safeNote}"\n`;

            // 4. Sử dụng mã BOM (Byte Order Mark) để ép Excel hiểu đây là UTF-8 (Giúp KHÔNG bị lỗi font tiếng Việt)
            const BOM = "\uFEFF";
            const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

            // 5. Tạo một liên kết ẩn để kích hoạt hành động tải file về máy khách
            const link = document.createElement("a");
            if (link.download !== undefined) {
                // Tạo URL từ đối tượng dữ liệu Blob vừa gom
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                
                // Đặt tên file tải về theo tên khách hàng để dễ quản lý
                // Ví dụ: Don_hang_Nguyen_Van_A.csv
                const fileName = `Don_hang_${fullname.replace(/\s+/g, "_")}.csv`;
                link.setAttribute("download", fileName);
                
                // Ẩn liên kết này đi và kích hoạt lệnh click tự động
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Thông báo cho khách hàng biết
                alert("🎉 Đặt hàng thành công! Đơn hàng của bạn đã được xuất ra file Excel và tải về máy.");
                
                // Xóa trống form sau khi đặt hàng xong để có thể nhập đơn khác
                orderForm.reset();
            }
        });
    }
});
