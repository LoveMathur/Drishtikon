import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonails';

// Unique reviews data
const testimonials = [
  {
    name: 'Narendra Modi',
    username: '@narendramodi',
    body: 'Today, India takes a defining step in its civil nuclear journey, advancing the second stage of its nuclear programme.',
    img: 'https://randomuser.me/api/portraits/women/32.jpg',
    country: '🇮🇳 India',
  },
  {
    name: 'BBC News UK',
    username: '@BBCNews',
    body: 'Bill Gates set to testify before US Congress in Epstein investigation',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    country: '🇬🇧 UK',
  },
  {
    name: 'The Guardian',
    username: '@guardian',
    body: 'Australians’ wages increase faster than inflation for fourth quarter running',
    img: 'https://randomuser.me/api/portraits/men/51.jpg',
    country: '🇬🇧 UK',
  },
  {
    name: 'Sambit Patra',
    username: '@sambitswaraj',
    body: 'भारत माता की जय🙏',
    img: 'https://randomuser.me/api/portraits/women/53.jpg',
    country: '🇮🇳 India',
  },
  {
    name: 'Al Jazeera English',
    username: '@AJEnglish',
    body: 'UK blocks rapper Kanye West from entry over anti-Semitism and Nazi support',
    img: 'https://randomuser.me/api/portraits/men/33.jpg',
    country: '🇶🇦 Qatar',
  },
  {
    name: 'Rahul Gandhi',
    username: '@RahulGandhi',
    body: 'Wars are tragic, yet they remain a reality.',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    country: '🇮🇳 India',
  },
  {
    name: 'The Wire',
    username: '@thewire_in',
    body: 'IAF Lost Fighter Jets to Pak Because of Political Leadership’s Constraints’: Indian Defence Attache',
    img: 'https://randomuser.me/api/portraits/men/85.jpg',
    country: '🇮🇳 India',
  },
  {
    name: 'CNN',
    username: '@cnn',
    body: 'Trump threatens "a whole civilization will die tonight"',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
    country: '🇺🇸 USA',
  },
  {
    name: 'Hindustan Times',
    username: '@HindustanTimes',
    body: '6 ministers from non-BJP states file review petition in Supreme Court for postponement of NEET, JEE.',
    img: 'https://randomuser.me/api/portraits/men/61.jpg',
    country: '🇮🇳 India',
  },
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-50">
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt="@reui_io" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-econdary-foreground">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export default function DemoOne() {
  return (
    <div className="border border-border rounded-lg relative flex h-96 w-full max-w-[800px] flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
        }}
      >
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Gradient overlays for vertical marquee */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  );
}
