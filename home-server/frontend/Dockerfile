FROM caddy:2.8-alpine AS runner

COPY --from=build /workspace/dist/apps/sparrow-home-mobile/browser /usr/share/caddy
RUN chmod -R 755 /usr/share/caddy

EXPOSE 80 443 443/udp
