import Image from 'next/image';

export default function EditButton() {
  return (
    <button className="rounded-[6.615px] border border-text-secondary flex items-center gap-[7.939px] py-[10.585px] px-[15.877px]">
      <Image src="/assets/settings/edit-icon.svg" alt="Edit" width={15.877} height={15.877} />
      <span className="text-text-secondary text-[15.877px] leading-[21.169px] font-sans ">
        Edit
      </span>
    </button>
  );
}
