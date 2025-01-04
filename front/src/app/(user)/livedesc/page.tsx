import React from "react";

export default function page() {
  return (
    <div className="mt-[200px] flex min-h-[100vh] flex-col items-center gap-2">
      <div>Bước 1: Mở OBS</div>
      <div>Bước 2: Vào Settings -{">"} Stream</div>
      <div>Bước 3: Ở mục Service chọn Custom</div>
      <div>Bước 4: Ở mục Server nhập giá trị: rtmp://10.0.3.87:1935/live/</div>
      <div>Bước 5: Ở mục Stream Key nhập giá trị: livestream</div>
    </div>
  );
}
