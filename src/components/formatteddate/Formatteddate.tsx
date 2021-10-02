import "./Formatteddate.css";

export function formatDate(mills: number) {
  const date = new Date(mills);
  const now = new Date();
  const diff = now.getTime() - mills;
  const diffSecond = diff / 1000;
  const diffMinute = diff / (1000 * 60);
  const diffHour = diff / (1000 * 60 * 60);
  const diffDay = diff / (1000 * 60 * 60 * 24);
  if (diffSecond < 60) {
    return Math.round(diffSecond) + "秒前";
  } else if (diffMinute < 60) {
    return Math.round(diffMinute) + "分钟前";
  } else if (diffHour < 24) {
    return Math.round(diffHour) + "小时前";
  } else if (diffDay < 8) {
    return Math.round(diffDay) + "天前";
  } else {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}

export default function Formatteddate({ date }: { date: number }) {
  return <span className="formatteddate">{formatDate(date)}</span>;
}
