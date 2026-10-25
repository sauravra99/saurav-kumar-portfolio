FROM ruby:3.3-slim
WORKDIR /app
RUN gem install webrick -v 1.9.1 --no-document \
    && useradd --create-home --uid 10001 linklens
COPY index.html ./index.html
COPY css ./css
COPY js ./js
COPY assets ./assets
COPY link-checker/server.rb ./link-checker/server.rb
COPY link-checker/public ./link-checker/public
ENV BIND_ADDRESS=0.0.0.0 PORT=9000
USER linklens
EXPOSE 9000
CMD ["ruby", "link-checker/server.rb"]
