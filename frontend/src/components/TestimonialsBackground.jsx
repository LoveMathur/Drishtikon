import { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { Card, CardContent } from './ui/Card';
import { Marquee } from './ui/Marquee';

// News testimonials data with consistent static images
const testimonials = [
  {
    name: 'Narendra Modi',
    username: '@narendramodi',
    body: 'Today, India takes a defining step in its civil nuclear journey, advancing the second stage of its nuclear programme.',
    img: 'https://ui-avatars.com/api/?name=NM&background=ff6b35&color=fff&size=128',
    country: '🇮🇳 India',
  },
  {
    name: 'BBC News UK',
    username: '@BBCNews',
    body: 'Bill Gates set to testify before US Congress in Epstein investigation',
    img: 'https://ui-avatars.com/api/?name=BBC&background=bb1919&color=fff&size=128',
    country: '🇬🇧 UK',
  },
  {
    name: 'The Guardian',
    username: '@guardian',
    body: 'Australians\' wages increase faster than inflation for fourth quarter running',
    img: 'https://ui-avatars.com/api/?name=TG&background=052962&color=fff&size=128',
    country: '🇬🇧 UK',
  },
  {
    name: 'Sambit Patra',
    username: '@sambitswaraj',
    body: 'भारत माता की जय🙏',
    img: 'https://ui-avatars.com/api/?name=SP&background=ff9933&color=fff&size=128',
    country: '🇮🇳 India',
  },
  {
    name: 'Al Jazeera English',
    username: '@AJEnglish',
    body: 'UK blocks rapper Kanye West from entry over anti-Semitism and Nazi support',
    img: 'https://ui-avatars.com/api/?name=AJ&background=d32027&color=fff&size=128',
    country: '🇶🇦 Qatar',
  },
  {
    name: 'Rahul Gandhi',
    username: '@RahulGandhi',
    body: 'Wars are tragic, yet they remain a reality.',
    img: 'https://ui-avatars.com/api/?name=RG&background=0066cc&color=fff&size=128',
    country: '🇮🇳 India',
  },
  {
    name: 'The Wire',
    username: '@thewire_in',
    body: 'IAF Lost Fighter Jets to Pak Because of Political Leadership\'s Constraints: Indian Defence Attache',
    img: 'https://ui-avatars.com/api/?name=TW&background=e63946&color=fff&size=128',
    country: '🇮🇳 India',
  },
  {
    name: 'CNN',
    username: '@cnn',
    body: 'Trump threatens "a whole civilization will die tonight"',
    img: 'https://ui-avatars.com/api/?name=CNN&background=cc0000&color=fff&size=128',
    country: '🇺🇸 USA',
  },
  {
    name: 'Hindustan Times',
    username: '@HindustanTimes',
    body: '6 ministers from non-BJP states file review petition in Supreme Court for postponement of NEET, JEE.',
    img: 'https://ui-avatars.com/api/?name=HT&background=0088cc&color=fff&size=128',
    country: '🇮🇳 India',
  },
];

// Memoized card component
const TestimonialCard = memo(function TestimonialCard({ img, name, username, body, country }) {
  return (
    <Card className="w-50 bg-white/5 backdrop-blur-sm border-white/10">
      <CardContent>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className="bg-white/10 text-white">{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-white/80 flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-white/50">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-white/60">{body}</blockquote>
      </CardContent>
    </Card>
  );
});

const TestimonialsBackground = memo(function TestimonialsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative flex h-full w-full flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:800px]">
        <div
          className="flex flex-row items-center gap-4 opacity-20"
          style={{
            transform:
              'translateX(-50px) translateY(0px) translateZ(-80px) rotateX(15deg) rotateY(-8deg) rotateZ(15deg)',
          }}
        >
          {/* Column 1: Vertical Marquee (downwards) */}
          <Marquee vertical pauseOnHover={false} repeat={3} className="[--duration:30s]">
            {testimonials.map((review) => (
              <TestimonialCard key={`col1-${review.username}`} {...review} />
            ))}
          </Marquee>
          
          {/* Column 2: Vertical Marquee (upwards) */}
          <Marquee vertical pauseOnHover={false} reverse repeat={3} className="[--duration:35s]">
            {testimonials.map((review) => (
              <TestimonialCard key={`col2-${review.username}`} {...review} />
            ))}
          </Marquee>
          
          {/* Column 3: Vertical Marquee (downwards) */}
          <Marquee vertical pauseOnHover={false} repeat={3} className="[--duration:40s]">
            {testimonials.map((review) => (
              <TestimonialCard key={`col3-${review.username}`} {...review} />
            ))}
          </Marquee>
          
          {/* Column 4: Vertical Marquee (upwards) */}
          <Marquee vertical pauseOnHover={false} reverse repeat={3} className="[--duration:32s]">
            {testimonials.map((review) => (
              <TestimonialCard key={`col4-${review.username}`} {...review} />
            ))}
          </Marquee>
        </div>
        
        {/* Gradient overlays for fading effect */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black via-black/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black via-black/60 to-transparent"></div>
      </div>
    </div>
  );
});

export default TestimonialsBackground;
