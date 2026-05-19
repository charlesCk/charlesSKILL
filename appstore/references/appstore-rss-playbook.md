# App Store RSS Playbook

## Lookup Apps

Search by product term:

```text
https://itunes.apple.com/search?term=VIPTHINK&entity=software&limit=10&country=us
https://itunes.apple.com/search?term=%E8%B1%8C%E8%B1%86%E6%80%9D%E7%BB%B4&entity=software&limit=10&country=cn
```

Important fields:

```text
trackId, trackName, bundleId, sellerName, averageUserRating,
userRatingCount, version, trackViewUrl
```

Known VIPTHINK/豌豆 product IDs:

```text
1387156850  豌豆素质（学生端）/ VIPTHINK豌豆思維
1462031301  豌豆素质家长端
```

## Review Endpoint

Fetch reviews:

```text
https://itunes.apple.com/<country-code>/rss/customerreviews/id=<app-id>/sortBy=mostRecent/json
```

Use headers:

```text
user-agent: Mozilla/5.0 appstore-review-collector
accept-language: zh-CN,zh;q=0.9,en;q=0.8
accept: application/json,text/plain,*/*
```

Country/region defaults for overseas Chinese education products:

```text
cn 中国大陆
us 美国
hk 中国香港
tw 中国台湾
mo 中国澳门
sg 新加坡
au 澳大利亚
ca 加拿大
gb 英国
my 马来西亚
nz 新西兰
```

## Review Fields

Apple RSS review entries normally contain:

```text
author.name.label
updated.label
im:rating.label
im:version.label
id.label
title.label
content.label
link.attributes.href
im:voteSum.label
im:voteCount.label
```

Recommended workbook columns:

```text
平台, App ID, 应用名称, 国家/地区, 地区代码, 评论ID,
评论作者, 更新时间, 日期, 评分, 版本, 标题, 评论内容,
有用票数, 投票数, 是否有效, 情绪, 主题, 评论链接
```

## Sorting

Sort detail rows by parsed `updated.label` descending, newest first. Keep the display string text-like, for example:

```text
2026-05-12 20:19:33 GMT-07:00
```

Avoid exporting Excel serial numbers in the visible `更新时间` column.

## Fallbacks

Apple RSS can intermittently return an empty `feed.entry` for a country/app. If the user has a trusted raw JSON from a prior run, configure it:

```json
{
  "fallbackFiles": {
    "1387156850|cn": "data/appstore_reviews_cn.json"
  }
}
```

Only use a fallback when live count is zero and fallback count is higher. Record `sourceNote` as `fallback:<file>` in the source log.

## Classification Hints

Negative:

```text
差, 不好, 垃圾, 退费, 退款, 打不开, 闪退, 卡, 耗电,
气死, 骗局, 投诉, 收费, 烧钱, 毁了, 无法, bug, crash
```

Positive:

```text
好, 很好, 不错, 喜欢, 推荐, 棒, 优秀, 满意, 方便,
进步, 有效, great, good, excellent, love, helpful
```

Topics:

```text
App性能/耗电
App稳定性/登录
价格/续费/退款
课程体验/效果
版本更新
其他
```
