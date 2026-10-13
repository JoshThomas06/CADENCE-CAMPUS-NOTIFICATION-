# Screen 02: Institutional Event Streaming & Multi-Channel Zero-Cost Dispatch
**Route:** \`/kafka-topics-telemetry\`  
**Cluster ID:** \`lk-inst-oxford-01\` • Broker v3.6.0 (KRaft / ZK Bridge)  
**Cloud SaaS Deficit:** $0.00 / billing cycle (Saved vs Twilio & SendGrid: $450/mo)

![South Quad & St. Jude Cloisters](https://lh3.googleusercontent.com/aida-public/AB6AXuAvMeMWzAGu5yOIjmn4vtRGiE27bAyXXzlYngb21ijQUB6Dyi1le1ZrQvrHjegZsd4_ZtdvSG5-5RERvhMV5_cObofzrWOcfdCxyUpTNHbhf43AlE5QMC7gQ9-kBBBiYCiDwLR_EAja0bvwfhN6E8KTIfgsuFSv6QXKG8r9bPqpkiJ6-T1qvPMF-CwMNuM11te-ramiFIsl695-a9khvyVxWl_tpuUJ4QZfmHiePiWgA8d1nMqmIjRmgw)

## Kafka Topic Partitions & Watermarks
- **campus.stream.class-updates:** 3 Partitions, High-water marks 6124, 6201, 6165. Lag: 0 msgs.
- **campus.stream.exam-updates:** 2 Partitions, High-water marks 4456, 4456. Critical Priority.
- **campus.stream.general-events:** 4 Partitions, High-water marks 8545, 8545, 8550, 8540. Retention: 7d.
