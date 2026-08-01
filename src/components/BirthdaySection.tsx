import { Cake, PartyPopper } from 'lucide-react';

type Member = {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  color: string;
  image?: string;
};

const members: Member[] = [
  {
    id: 'lee-jaegeon',
    name: '이재건',
    birthDate: '2000-08-01',
    color: 'from-sky-500 to-blue-600',
    image: '/profile/jaegeon.jpg',
  },
  {
    id: 'choi-jinhyuk',
    name: '최진혁',
    birthDate: '2000-08-12',
    color: 'from-emerald-500 to-teal-600',
    image: '/profile/jinhyuk.png',
  },
  {
    id: 'an-chiguk',
    name: '안치국',
    birthDate: '2000-01-02',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'seo-yugwan',
    name: '서유관',
    birthDate: '2000-11-14',
    color: 'from-violet-500 to-purple-600',
    image: '/profile/yugwan.png',
  },
  {
    id: 'park-hyeongyeom',
    name: '박현겸',
    birthDate: '2000-05-27',
    color: 'from-rose-500 to-pink-600',
    image: '/profile/hyeongyeom.png',
  },
  {
    id: 'park-seongmin',
    name: '박성민',
    birthDate: '2000-05-31',
    color: 'from-cyan-500 to-sky-600',
    image: '/profile/seongmin.png',
  },
  {
    id: 'jang-junhyeok',
    name: '장준혁',
    birthDate: '2000-10-16',
    color: 'from-lime-500 to-green-600',
  },
  {
    id: 'moon-jeyeong',
    name: '문제영',
    birthDate: '2000-10-09',
    color: 'from-fuchsia-500 to-rose-600',
    image: '/profile/jeyeong.png',
  },
  {
    id: 'han-jaeyeong',
    name: '한재영',
    birthDate: '2000-05-18',
    color: 'from-indigo-500 to-blue-600',
    image: '/profile/jaeyeong.png',
  },
  {
    id: 'son-heungmin',
    name: '우리흥',
    birthDate: '1992-07-08',
    color: 'from-yellow-500 to-orange-600',
    image: '/profile/heungmin.jpeg',
  },
  {
    id: 'lee-kangin',
    name: '이강인',
    birthDate: '2001-02-19',
    color: 'from-yellow-500 to-orange-600',
    image: '/profile/kangin.jpeg',
  },
];

const formatBirthDate = (birthDate: string) => {
  const [year, month, day] = birthDate.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
};

const getDaysUntilNextBirthday = (birthDate: string) => {
  const [, month, day] = birthDate.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let nextBirthday = new Date(today.getFullYear(), month - 1, day);
  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, month - 1, day);
  }

  const diffMs = nextBirthday.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

const withDday = members.map((member) => ({
  ...member,
  daysUntil: getDaysUntilNextBirthday(member.birthDate),
}));

const sortedMembers = [...withDday].sort((a, b) => a.daysUntil - b.daysUntil);

const BirthdaySection = () => {
  return (
    <section
      id="birthday"
      className="relative scroll-mt-24 overflow-hidden px-3 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.18)] backdrop-blur-md sm:p-10 lg:p-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-[0.18em] text-slate-500">
              BIRTHDAY
            </p>
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              멤버 생일
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              FC 능곡 멤버들의 생일을 확인하고 축하해 주세요.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {sortedMembers.map((member) => {
              const isNext = member.daysUntil === sortedMembers[0].daysUntil;
              return (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/70 p-5 transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)]"
                >
                  <div className="flex items-center gap-4">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${member.color} text-lg font-bold text-white`}
                      >
                        {member.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-slate-950">
                        {member.name}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Cake className="h-3.5 w-3.5" />
                        {formatBirthDate(member.birthDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                    <span className="text-xs text-slate-500">
                      {member.daysUntil === 0 ? '오늘 생일' : '다음 생일까지'}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                      {isNext && (
                        <PartyPopper className="h-4 w-4 text-amber-500" />
                      )}
                      {member.daysUntil === 0 ? '🎉' : `D-${member.daysUntil}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BirthdaySection;
