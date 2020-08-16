# Info
Get zulip notifications from azure devops through slack incoming webhook

# Example usage
We proxy the request while changing the body

```bash
docker run --rm -it -p 3000:3000 -e "DOMAIN=https://zulipdomain.com" yonixw/azure-zulip-slack-adapter
```

and then you can use it by POST to:

```
http://localhost:3000/process/api/v1/external/slack_incoming?api_key=<APIKEY>&stream=general
```

With Body (example from azure slack service hooks):

```json
{
"attachments": [
    {
      "color": "good",
      "fields": [
        {
          "title": "Requested by",
          "value": "Normal Paulk",
          "short": true
        },
        {
          "title": "Duration",
          "value": "00:02:03",
          "short": true
        },
        {
          "title": "Build pipeline",
          "value": "ConsumerAddressModule",
          "short": true
        }
      ],
      "pretext": "Build <https://fabrikam-fiber-inc.visualstudio.com/web/build.aspx?pcguid=5023c10b-bef3-41c3-bf53-686c4e34ee9e&builduri=vstfs%3a%2f%2f%2fBuild%2fBuild%2f3|ConsumerAddressModule_20150407.2> succeeded",
      "mrkdwn_in": [
        "pretext"
      ],
      "fallback": "Build ConsumerAddressModule_20150407.2 succeeded"
    }
  ]
}
```

